# Load More Pagination System Documentation

## Overview

This document describes the **Load More** pagination system implemented in the Map View Listings page. Users can progressively load more properties by clicking a button, with 50 properties per page.

## Architecture

### Key Components

#### 1. **State Management**

```typescript
// Pagination state
isLoadingMore: boolean                    // Loading state while fetching next page
loadMoreInFlightRef: React.MutableRefObject // Prevents duplicate API calls

// Meta information from API (updated on each load)
meta: {
    currentPage: number;                  // Current page number (1-indexed)
    totalPages: number;                   // Total pages available
    totalItems: number;                   // Total items across all pages
    perPage: number;                      // Items per page
}

// Data storage
mapMarkers: MapMarkerData[];              // Currently loaded property markers
properties: PropertyImage[];              // Currently loaded raw properties
```

#### 2. **Data Flow**

```
User Clicks County Circle
        ↓
First useEffect Triggers
        ↓
API Fetches Page 1 (50 items)
        ↓
Display 20 properties + "Load More" button
        ↓
User Clicks "Load More" Button
        ↓
handleLoadMore() Executes
        ↓
API Fetches Page 2 (next 50 items)
        ↓
Append: setMapMarkers(prev => [...prev, ...newMarkers])
        ↓
Meta updated with new currentPage
        ↓
If currentPage < totalPages: Show "Load More" again
        ↓
If currentPage >= totalPages: Hide "Load More" button
```

## Implementation Details

### handleLoadMore Function

```typescript
const handleLoadMore = async () => {
    // 1. Check for duplicate requests
    if (loadMoreInFlightRef.current || isLoadingMore) return;
    
    // 2. Check if there are more pages
    if (meta.currentPage >= meta.totalPages) return;

    // 3. Lock to prevent duplicates
    loadMoreInFlightRef.current = true;
    setIsLoadingMore(true);

    try {
        // 4. Calculate next page
        const nextPage = meta.currentPage + 1;
        
        // 5. Build API parameters (same filters as original)
        const params = new URLSearchParams();
        params.set("limit", "50");
        params.set("page", nextPage.toString());
        // ... add all active filters
        
        // 6. Fetch next page
        const response = await api.get<ApiResponse>(apiUrl);

        // 7. Append new data (don't replace)
        setProperties((prev) => [...prev, ...response.data.data.data]);
        setMapMarkers((prev) => [...prev, ...newMarkers]);
        
        // 8. Update pagination meta
        setMeta(response.data.data.meta);
        
    } catch (error) {
        console.error("Error loading more properties:", error);
    } finally {
        // 9. Unlock for next request
        loadMoreInFlightRef.current = false;
        setIsLoadingMore(false);
    }
};
```

### Load More Button (Desktop & Mobile)

```typescript
{meta.currentPage < meta.totalPages && (
    <div className="border-t p-3 bg-gray-50">
        <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
            {isLoadingMore ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <span>Load More Properties</span>
            )}
        </button>
    </div>
)}
```

## Features

### ✅ Simple & Explicit
- User-controlled loading (not automatic)
- Clear "Load More" button
- No silent background requests

### ✅ Data Preservation
- Append pattern: `setData(prev => [...prev, ...newData])`
- All previous properties remain visible
- No data loss or re-renders

### ✅ No Duplicates
- `loadMoreInFlightRef` prevents concurrent requests
- Single request in flight at a time
- Safe to rapidly click button

### ✅ Smart Guards
- Hides button when all pages loaded
- Disables button while loading
- Only shows when more data exists

### ✅ Responsive UI
- Works on desktop (vertical scroll)
- Works on mobile (horizontal scroll)
- Same logic, different layouts

### ✅ Loading Feedback
- Spinner icon during load
- "Loading..." text
- Button disabled state
- No page reset or flicker

### ✅ Production-Grade
- TypeScript type-safe
- Modular logic
- Clean error handling
- Proper state management

## API Contract

### Request

```typescript
GET /properties/all-properties-map?page=2&limit=50&county=...&sortBy=...

Parameters:
- page: number (1-indexed)
- limit: 50 (items per page)
- county: string (selected county)
- search: string (search query)
- sortBy: string (sort field)
- order: asc|desc
- mlsStatus: Active|all
- propertyType: string
- propertySubtype: string
```

### Response

```typescript
{
  success: boolean;
  message: string;
  data: {
    meta: {
      currentPage: 2;              // Current page
      totalPages: 5;               // Total pages available
      totalItems: 250;             // Total items across all pages
      perPage: 50;                 // Items returned per page
    };
    data: PropertyImage[];         // 50 property objects
  }
}
```

## Usage Flow

### Scenario 1: County with Multiple Pages

1. User clicks "Westchester County"
2. First useEffect fetches page 1 (50 properties)
3. Properties displayed in list
4. Meta shows: `currentPage: 1, totalPages: 5`
5. "Load More" button visible
6. User scrolls down and sees button
7. User clicks "Load More"
8. `handleLoadMore()` fetches page 2
9. 50 new properties appended to list
10. Total now: 100 properties visible
11. Meta shows: `currentPage: 2, totalPages: 5`
12. "Load More" button still visible
13. Process repeats for pages 3, 4, 5
14. On page 5: Meta shows `currentPage: 5, totalPages: 5`
15. Button hidden (no more pages)

### Scenario 2: Single Page Results

1. User clicks "Manhattan"
2. First useEffect fetches page 1 (30 properties)
3. Properties displayed
4. Meta shows: `currentPage: 1, totalPages: 1`
5. "Load More" button NOT shown
6. `meta.currentPage >= meta.totalPages` is true

### Scenario 3: Changing Filters

1. Properties loaded from page 1
2. User changes sort order
3. First useEffect triggers (dependency changed)
4. Previous data cleared
5. New page 1 fetched
6. Meta reset with new data
7. "Load More" button reappears
8. Process starts fresh

## State Management

### When Page Loads

```typescript
// Initial state
isLoadingMore = false
meta = { currentPage: 1, totalPages: 5, totalItems: 250, perPage: 50 }
mapMarkers = [50 items]
```

### When Load More Button Clicked

```typescript
// Before request
isLoadingMore = true
loadMoreInFlightRef.current = true

// During request
// (button disabled, spinner shown)

// After successful response
isLoadingMore = false
loadMoreInFlightRef.current = false
meta = { currentPage: 2, totalPages: 5, totalItems: 250, perPage: 50 }
mapMarkers = [100 items]  // Old + New
```

### When Last Page Reached

```typescript
// After page 5 loads
meta.currentPage = 5
meta.totalPages = 5

// Button condition check
if (meta.currentPage < meta.totalPages) return;  // 5 < 5 is FALSE
// Button hidden
```

## Performance

### Memory
- 50 items per page × ~1KB per item = ~50KB per page
- 5 pages × 50KB = ~250KB total (acceptable)

### Network
- First load: 50-100KB (50 items + metadata)
- Each "Load More": 50-100KB
- No pre-fetching or waste

### Rendering
- React efficiently renders only new items
- No full list re-render
- Map markers update incrementally

### Preventing Waste
- `loadMoreInFlightRef` stops duplicate requests immediately
- `isLoadingMore` flag prevents state updates
- Guard clause checks `currentPage >= totalPages`

## Troubleshooting

### Issue: "Load More" button doesn't appear

**Checklist:**
- [ ] Is `meta.currentPage < meta.totalPages` true?
- [ ] Check browser DevTools: API response includes correct meta?
- [ ] Console: any API errors?
- [ ] Is `selectedCounty` set (or filters active)?

**Solution:**
```typescript
// Add debug log
console.log("Pagination Debug:", {
    currentPage: meta.currentPage,
    totalPages: meta.totalPages,
    shouldShow: meta.currentPage < meta.totalPages
});
```

### Issue: Button disabled but not loading

**Checklist:**
- [ ] Is `isLoadingMore` stuck as true?
- [ ] Is `loadMoreInFlightRef.current` stuck as true?
- [ ] Check network tab for failed request

**Solution:**
```typescript
// Manual reset (development only)
setIsLoadingMore(false);
loadMoreInFlightRef.current = false;
```

### Issue: Duplicate data appearing

**Checklist:**
- [ ] Is append pattern used? `[...prev, ...newData]` ✓
- [ ] API returning unique items per page?
- [ ] IDs not duplicated?

**Solution:**
```typescript
// Add deduplication
const appendDataUnique = (existing, newData) => {
    const ids = new Set(existing.map(i => i.id));
    const unique = newData.filter(i => !ids.has(i.id));
    return [...existing, ...unique];
};

setMapMarkers(prev => appendDataUnique(prev, newMarkers));
```

### Issue: Multiple requests fired

**Root Cause:** `loadMoreInFlightRef` not working properly

**Debug:**
```typescript
// Add logging
const handleLoadMore = async () => {
    console.log("Lock before:", loadMoreInFlightRef.current);
    if (loadMoreInFlightRef.current) {
        console.log("Request blocked - already in flight");
        return;
    }
    
    loadMoreInFlightRef.current = true;
    console.log("Lock set");
    // ... rest of function
};
```

## Customization

### Change Items Per Page

```typescript
// In handleLoadMore function
params.set("limit", "100");  // Change from 50 to 100

// Must match API configuration
```

### Change Button Text

```typescript
<button onClick={handleLoadMore} disabled={isLoadingMore}>
    {isLoadingMore ? (
        <>
            <Loader2 size={16} className="animate-spin" />
            <span>Fetching more...</span>  // Change this
        </>
    ) : (
        <span>Show More Results</span>  // Or this
    )}
</button>
```

### Add Loading Progress

```typescript
{isLoadingMore && (
    <div className="text-center text-sm text-gray-600">
        Loading {mapMarkers.length + 50}/{meta.totalItems} properties...
    </div>
)}
```

### Add Success Message

```typescript
const [justLoaded, setJustLoaded] = useState(false);

// In handleLoadMore after success
setJustLoaded(true);
setTimeout(() => setJustLoaded(false), 2000);

// In render
{justLoaded && (
    <div className="text-center text-sm text-green-600">
        ✓ Loaded {50} more properties!
    </div>
)}
```

## Testing Checklist

- [ ] Click county → Page 1 (50 items) loaded
- [ ] "Load More" button visible
- [ ] Click button → Page 2 loaded, appended to list
- [ ] Total now shows 100 items
- [ ] Click again → Page 3 loaded (150 total)
- [ ] Continue until last page
- [ ] Last page reached → Button hidden
- [ ] Rapid clicking → No duplicate requests
- [ ] Network tab shows correct page sequence
- [ ] Mobile layout → Works same way
- [ ] Change filter → Data resets to page 1
- [ ] Switch county → Previous data cleared, new page 1 loaded

## Files Modified

1. **src/pages/MapViewListings.tsx**
   - Added `isLoadingMore` state (line ~154)
   - Added `loadMoreInFlightRef` ref (line ~155)
   - Added `handleLoadMore` function (line ~435-509)
   - Added "Load More" button to desktop panel (line ~1076-1091)
   - Added "Load More" button to mobile sheet (line ~1152-1167)

## Summary

The **Load More** pagination system provides:

✅ Explicit user-controlled pagination  
✅ 50 items per page  
✅ Append-based data loading (no loss)  
✅ Duplicate request prevention  
✅ Smart button visibility  
✅ Loading feedback  
✅ Responsive across devices  
✅ Production-grade TypeScript  

**Result:** A clean, maintainable pagination system that scales gracefully from small datasets to large ones!
