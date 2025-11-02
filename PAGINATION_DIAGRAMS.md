# Load More Pagination - Visual Diagrams

## 1. State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PAGINATION STATE MACHINE                 │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  INITIAL STATE   │
                    │  isLoadingMore=f │
                    │  page=1          │
                    │  totalPages=?    │
                    └────────┬─────────┘
                             │
                    County Selected / Filters Applied
                             │
                             ▼
                    ┌──────────────────┐
                    │  PAGE 1 LOADED   │
                    │  50 properties   │
                    │  Button visible  │
                    └────────┬─────────┘
                             │
                    User clicks "Load More"
                             │
                             ▼
                    ┌──────────────────┐
                    │   LOADING PAGE   │
                    │  isLoadingMore=t │
                    │  Button disabled │
                    │  Spinner shown   │
                    └────────┬─────────┘
                             │
                    API response received
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │  PAGE N LOADED       │   │  ALL PAGES LOADED    │
    │  100 properties      │   │  page=totalPages     │
    │  Button still shown  │   │  Button hidden       │
    │  More pages exist    │   │  No more pages       │
    └────────┬─────────────┘   └──────────────────────┘
             │
             │ User clicks "Load More" again
             │
             └────────────────┬─────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   LOADING PAGE   │
                     │  isLoadingMore=t │
                     └────────┬─────────┘
                              │
                              └──→ Repeat cycle or end
```

## 2. Data Accumulation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA ACCUMULATION PATTERN                     │
└─────────────────────────────────────────────────────────────────┘

Initial State:
  mapMarkers = []
  properties = []

After County Selection (Page 1):
  mapMarkers = [Prop1, Prop2, ..., Prop50]
  properties = [...]
  Count: 50

After First "Load More" (Page 2):
  mapMarkers = [Prop1...Prop50, Prop51, Prop52, ..., Prop100]
                └─────────────┬──────────────┘
                    PRESERVED   APPENDED
  properties = [...]
  Count: 100

After Second "Load More" (Page 3):
  mapMarkers = [Prop1...Prop100, Prop101, Prop102, ..., Prop150]
                └────────────┬────────────┘
                  PRESERVED    APPENDED
  properties = [...]
  Count: 150

✓ No data loss
✓ Smooth accumulation
✓ All data preserved
```

## 3. Request Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   API REQUEST SEQUENCE                           │
└─────────────────────────────────────────────────────────────────┘

Timeline:
═════════════════════════════════════════════════════════════════

T0: User clicks county
    ↓
T1: First useEffect triggers
    ↓
T2: API Request: GET /properties?page=1&limit=50&county=Westchester
    │
T3: API Response: 50 properties + meta {currentPage:1, totalPages:5}
    │
T4: Render: Display 50 properties + "Load More" button
    │
    ├─────────────────────────────────────────────────────────────
    │
T5: User clicks "Load More" button
    ↓
T6: handleLoadMore() checks:
    ├─ loadMoreInFlightRef.current? NO ✓
    ├─ isLoadingMore? NO ✓
    ├─ currentPage (1) >= totalPages (5)? NO ✓
    └─ All checks pass → proceed
    ↓
T7: Set loadMoreInFlightRef = true, isLoadingMore = true
    ↓
T8: API Request: GET /properties?page=2&limit=50&county=Westchester
    │   (same filters as before)
    │
T9: API Response: 50 more properties + meta {currentPage:2, totalPages:5}
    │
T10: Append data: setMapMarkers(prev => [...prev, ...new50])
     │
T11: Update meta: currentPage=2
     │
T12: Set loadMoreInFlightRef = false, isLoadingMore = false
     │
T13: Render: Display 100 properties + "Load More" button (still visible)
     │
     └─────────────────────────────────────────────────────────────
       (Repeat T5-T13 for pages 3, 4, 5)

When all pages loaded (currentPage=5, totalPages=5):
T14: "Load More" button condition check:
     if (currentPage < totalPages) → if (5 < 5) → FALSE
     ↓
T15: Button hidden (not rendered)
```

## 4. Duplicate Prevention Mechanism

```
┌─────────────────────────────────────────────────────────────────┐
│              TRIPLE-LAYER DUPLICATE PREVENTION                   │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Ref-Based (Immediate, Synchronous)
══════════════════════════════════════════════
User clicks button
  ↓
handleLoadMore() called
  ↓
Check: if (loadMoreInFlightRef.current) return;
  ├─ First click: false → continue
  ├─ Second click (same ms): true → BLOCKED ✓
  └─ After request ends: false → allow next
  ↓
Set: loadMoreInFlightRef.current = true
  ↓
Only ONE request can be in flight at a time


Layer 2: State-Based (React render cycle, Backup)
═══════════════════════════════════════════════════
Inside try block:
  ↓
Check: if (isLoadingMore) return;
  ├─ Already loading: true → BLOCKED ✓
  ├─ Prevents render-time duplicates
  └─ Backup safety if ref fails


Layer 3: Logic-Based (Business rules, Safety net)
═══════════════════════════════════════════════════
Check: if (meta.currentPage >= meta.totalPages) return;
  ├─ If on last page: true → BLOCKED ✓
  ├─ Prevents unnecessary requests
  └─ Respects API contract


Result:
───────
Even if user clicks 100 times per second:
✓ Only 1 request in flight
✓ All duplicates blocked
✓ Clean state management
✓ No orphaned promises
```

## 5. Button Visibility Logic

```
┌─────────────────────────────────────────────────────────────────┐
│               BUTTON VISIBILITY DECISION TREE                    │
└─────────────────────────────────────────────────────────────────┘

On every render:
  │
  ├─ Check: meta.currentPage < meta.totalPages?
  │
  ├─ YES (e.g., page 2 < totalPages 5)
  │  │
  │  ├─ isLoadingMore = false?
  │  │  ├─ YES → Show enabled button with "Load More" text
  │  │  └─ NO  → Show disabled button with spinner + "Loading..."
  │  │
  │  └─ Button visible ✓
  │
  └─ NO (e.g., page 5 >= totalPages 5)
     │
     └─ Button not rendered (hidden) ✓


Example Scenarios:
═════════════════

Scenario 1: Page 1 of 5, not loading
  meta.currentPage: 1
  meta.totalPages: 5
  isLoadingMore: false
  │
  ├─ 1 < 5? YES
  ├─ isLoadingMore? NO
  └─ Result: ✓ Show enabled "Load More" button


Scenario 2: Page 3 of 5, currently loading
  meta.currentPage: 3
  meta.totalPages: 5
  isLoadingMore: true
  │
  ├─ 3 < 5? YES
  ├─ isLoadingMore? YES
  └─ Result: ✓ Show disabled button with "Loading..."


Scenario 3: Page 5 of 5 (last page)
  meta.currentPage: 5
  meta.totalPages: 5
  isLoadingMore: false
  │
  ├─ 5 < 5? NO
  └─ Result: ✓ Hide button completely
```

## 6. Component Rendering Tree

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPONENT RENDERING HIERARCHY                       │
└─────────────────────────────────────────────────────────────────┘

MapViewListings
  │
  ├─ [Desktop] Properties Panel
  │  │
  │  ├─ Panel Header
  │  │  └─ "{mapMarkers.length} Properties"
  │  │
  │  ├─ Properties List Container
  │  │  │
  │  │  ├─ Property Card 1
  │  │  ├─ Property Card 2
  │  │  ├─ ...
  │  │  └─ Property Card 50
  │  │
  │  └─ Load More Section (conditional)
  │     │
  │     └─ Button
  │        ├─ if (isLoadingMore)
  │        │  ├─ Spinner icon
  │        │  └─ "Loading..."
  │        └─ else
  │           └─ "Load More Properties"
  │
  └─ [Mobile] Bottom Sheet (conditional)
     │
     ├─ Handle bar
     ├─ Header
     ├─ Properties Horizontal Scroll
     │  │
     │  ├─ Property Card 1
     │  ├─ Property Card 2
     │  └─ ...
     │
     └─ Load More Section (conditional)
        │
        └─ Same button logic as desktop


Only Desktop:
  Shown on lg and above (≥1024px)
  Vertical scroll in sidebar
  Fixed panel on right side

Only Mobile:
  Shown on md and below (<1024px)
  Draggable bottom sheet
  Horizontal scroll in sheet
```

## 7. Filter Interaction Impact

```
┌─────────────────────────────────────────────────────────────────┐
│              FILTER CHANGES & PAGINATION RESET                   │
└─────────────────────────────────────────────────────────────────┘

When user changes county/filters:
  │
  ├─ selectedCounty OR query OR sortField changes
  ├─ First useEffect dependency triggered
  ├─ setCurrentPage(1) called
  ├─ setProperties([]) - clear old data
  ├─ setMapMarkers([]) - clear old markers
  │
  ├─ New API request: page=1 (fresh start)
  │
  ├─ New response with new meta:
  │  ├─ currentPage: 1
  │  ├─ totalPages: ? (new county may have different count)
  │  ├─ totalItems: ? (different dataset)
  │  └─ perPage: 50
  │
  ├─ Load More button reappears (if totalPages > 1)
  │
  └─ Pagination starts fresh ✓


Old Page 3 data: DISCARDED ✓
New Page 1 data: LOADED ✓
No mixing: SAFE ✓
No duplicate: CLEAN ✓
```

## 8. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                           │
└─────────────────────────────────────────────────────────────────┘

handleLoadMore()
  │
  ├─ Guards pass
  ├─ Set loading state
  │
  ├─ try {
  │  │
  │  ├─ Build params
  │  ├─ Make API call
  │  ├─ Check response.data.success
  │  │
  │  ├─ Success path:
  │  │  ├─ Append data
  │  │  ├─ Update meta
  │  │  └─ All good ✓
  │  │
  │  └─ On any error → catch block
  │
  ├─ } catch (error) {
  │  │
  │  ├─ Log error to console
  │  ├─ User sees nothing break
  │  ├─ Button returns to normal state
  │  ├─ Data preserved (nothing appended)
  │  └─ Can retry by clicking again ✓
  │
  ├─ } finally {
  │  │
  │  ├─ Always clear loading state
  │  ├─ Always unlock ref
  │  ├─ Ensures cleanup happens
  │  └─ Button becomes clickable again ✓
  │
  └─ Return to idle state


Result:
  ✓ No crash on API errors
  ✓ Data integrity preserved
  ✓ User can retry
  ✓ Logging for debugging
```

---

These diagrams show the complete flow, state management, and safety mechanisms of the Load More pagination system.
