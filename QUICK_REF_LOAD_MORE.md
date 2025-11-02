# Load More Pagination - Quick Reference Card

## 🎯 What It Does

- User clicks county → Loads 50 properties
- User clicks "Load More" → Loads next 50 properties
- Data appends (doesn't replace)
- Button hides when all pages loaded
- Shows loading spinner while fetching

## 📊 State Variables

```typescript
isLoadingMore          // true while fetching next page
loadMoreInFlightRef    // Prevents duplicate requests
meta.currentPage       // Current page from API (1-indexed)
meta.totalPages        // Total pages available from API
meta.totalItems        // Total items across all pages
meta.perPage          // Items per page (50)
```

## 🔄 Data Flow

```
User: Click County
  ↓ (First useEffect)
API: GET page=1, limit=50
  ↓
Data: 50 properties loaded
Button: "Load More" shown
  ↓
User: Click "Load More" button
  ↓ (handleLoadMore)
API: GET page=2, limit=50
  ↓
Data: append 50 more (total 100)
Button: Still shown (if page < totalPages)
```

## 🚀 Core Function

```typescript
const handleLoadMore = async () => {
    // Guard 1: Prevent duplicate requests
    if (loadMoreInFlightRef.current || isLoadingMore) return;
    
    // Guard 2: No more pages
    if (meta.currentPage >= meta.totalPages) return;

    // Lock it
    loadMoreInFlightRef.current = true;
    setIsLoadingMore(true);

    try {
        // Fetch next page
        const nextPage = meta.currentPage + 1;
        const response = await api.get(`/properties/all-properties-map?page=${nextPage}&limit=50...`);

        // Append new data (don't replace!)
        setProperties(prev => [...prev, ...response.data.data.data]);
        setMapMarkers(prev => [...prev, ...newMarkers]);
        
        // Update meta
        setMeta(response.data.data.meta);
    } finally {
        // Unlock
        loadMoreInFlightRef.current = false;
        setIsLoadingMore(false);
    }
};
```

## 🔘 Button UI

```typescript
{/* Show button ONLY if more pages exist */}
{meta.currentPage < meta.totalPages && (
    <button onClick={handleLoadMore} disabled={isLoadingMore}>
        {isLoadingMore ? (
            <> <Loader2 className="animate-spin" /> Loading... </>
        ) : (
            "Load More Properties"
        )}
    </button>
)}
```

## ✅ Critical Patterns

| Pattern | Why |
|---------|-----|
| `[...prev, ...new]` | Append data, don't replace |
| `loadMoreInFlightRef` | Prevent duplicate requests immediately |
| `isLoadingMore` state | Prevent render-time duplicates |
| `currentPage < totalPages` | Smart button visibility |
| `meta.currentPage + 1` | Calculate next page from response |

## 🐛 Debugging

**Check if button shows:**
```typescript
console.log(meta.currentPage, '<', meta.totalPages);  // Should be true
```

**Check if appending works:**
```typescript
console.log(mapMarkers.length);  // Should be 50, 100, 150, etc.
```

**Check for duplicates:**
```typescript
const ids = new Set(mapMarkers.map(m => m.id));
console.log(ids.size === mapMarkers.length);  // Should be true
```

**Check for duplicate requests:**
```typescript
// DevTools → Network → Filter: all-properties-map
// Should see: page=1, page=2, page=3, etc.
// Never: page=2 twice
```

## 🎨 Customization

**Change items per page (50 → 100):**
```typescript
params.set("limit", "100");  // in handleLoadMore
```

**Change button text:**
```typescript
"Load More Properties"  // → "Show More Results"
```

**Change button styling:**
```typescript
className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 ..."
// Add custom Tailwind classes
```

## 📋 File Locations

| What | Where |
|------|-------|
| Main code | `src/pages/MapViewListings.tsx` (Lines ~435-509, ~1076-1091, ~1152-1167) |
| State vars | Lines ~154-155 |
| Handler | Lines ~435-509 |
| Button (desktop) | Lines ~1076-1091 |
| Button (mobile) | Lines ~1152-1167 |

## 🧪 Quick Test

1. Navigate to `/listings-map-view`
2. Click any county circle
3. Should see 50 properties
4. Scroll down → "Load More" button visible
5. Click button → Next 50 properties appended
6. Check DevTools Network → See page=1, page=2 requests
7. Repeat until button disappears (all pages loaded)

## ⚙️ How Duplicate Prevention Works

**Layer 1: Ref-based (immediate)**
```typescript
if (loadMoreInFlightRef.current) return;  // Blocks instantly
loadMoreInFlightRef.current = true;
```

**Layer 2: State-based (backup)**
```typescript
if (isLoadingMore) return;  // React state check
setIsLoadingMore(true);
```

**Layer 3: Logic-based (safety)**
```typescript
if (meta.currentPage >= meta.totalPages) return;  // No more pages
```

## 📱 Responsive

- **Desktop**: Button in sidebar panel
- **Mobile**: Button in bottom sheet
- **Same logic**, different layout
- **Same guards**, same behavior

## 🚨 Common Mistakes

❌ Using `setData(newData)` instead of `setData(prev => [...prev, ...new])`  
✅ Always append, never replace

❌ Not checking `loadMoreInFlightRef.current`  
✅ Always prevent concurrent requests

❌ Forgetting to update `meta` from response  
✅ Meta tells button when to show/hide

❌ Ignoring error handling  
✅ Try/catch with finally to unlock

## 🎓 Learning Path

1. **Understand**: Read data flow diagram above
2. **Locate**: Find `handleLoadMore` in MapViewListings.tsx
3. **Read**: Check comments in the function
4. **Test**: Follow "Quick Test" steps
5. **Debug**: Use debugging commands above
6. **Customize**: Change button text/styling
7. **Deploy**: It's production-ready!

## 📞 Need Help?

See `LOAD_MORE_PAGINATION.md` for:
- Full architecture explanation
- API contract details
- Troubleshooting guide
- Performance analysis
- Advanced customization

---

**Version**: 1.0  
**Status**: ✅ Production Ready  
**Last Updated**: Nov 2, 2025
