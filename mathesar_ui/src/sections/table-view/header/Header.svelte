<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import {
    GROUP_MARGIN_LEFT,
    ROW_CONTROL_COLUMN_WIDTH,
    DEFAULT_ROW_RIGHT_PADDING,
  } from '@mathesar/stores/table-data';

  import type {
    TabularDataStore,
    TabularData,
    TableColumn,
    ColumnPosition,
    ColumnPositionMap,
  } from '@mathesar/stores/table-data/types';
  import HeaderCell from './HeaderCell.svelte';

  const tabularData = getContext<TabularDataStore>('tabularData');
  $: ({
    columns, records, meta, display,
  } = $tabularData as TabularData);
  $: ({ horizontalScrollOffset, rowWidth, columnPositionMap } = display as TabularData['display']);

  $: paddingLeft = $records.groupData ? GROUP_MARGIN_LEFT : 0;

  let headerRef: HTMLElement;

  function onHScrollOffsetChange(_hscrollOffset: number) {
    if (headerRef) {
      headerRef.scrollLeft = _hscrollOffset;
    }
  }

  $: onHScrollOffsetChange($horizontalScrollOffset);

  function onHeaderScroll(scrollLeft: number) {
    if ($horizontalScrollOffset !== scrollLeft) {
      $horizontalScrollOffset = scrollLeft;
    }
  }

  function getColumnPosition(
    _columnPositionMap: ColumnPositionMap,
    _name: TableColumn['name'],
  ): ColumnPosition {
    return _columnPositionMap.get(_name);
  }

  onMount(() => {
    onHScrollOffsetChange($horizontalScrollOffset);

    const scrollListener = (event: Event) => {
      const { scrollLeft } = event.target as HTMLElement;
      onHeaderScroll(scrollLeft);
    };

    headerRef.addEventListener('scroll', scrollListener);

    return () => {
      headerRef.removeEventListener('scroll', scrollListener);
    };
  });
</script>

<div bind:this={headerRef} class="header">
  <div class="cell row-control" style="width:{ROW_CONTROL_COLUMN_WIDTH + paddingLeft}px;">
  </div>

  {#each $columns.data as column (column.name)}
    <HeaderCell {column} {meta} {paddingLeft}
      columnPosition={getColumnPosition($columnPositionMap, column.name)}/>
  {/each}

  <div class="cell" style="
    width:{DEFAULT_ROW_RIGHT_PADDING + paddingLeft}px;
    left:{$rowWidth + paddingLeft}px">
  </div>
</div>
