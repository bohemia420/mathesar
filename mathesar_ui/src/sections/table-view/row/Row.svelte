<script lang="ts">
  import type {
    TableColumnData,
    ColumnPosition,
    TableRecord,
    GroupData,
    ActiveCell,
  } from '@mathesar/stores/tableData';
  import { calculateRowStyle } from './rowUtils';
  import GroupHeader from './GroupHeader.svelte';
  import RowControl from './RowControl.svelte';
  import Cell from './Cell.svelte';

  export let index: number;
  export let columns: TableColumnData;
  export let row: TableRecord;
  export let isGrouped = false;
  export let columnPosition: ColumnPosition;
  export let style: { [key: string]: string | number };
  export let groupData: GroupData;
  export let selected: Record<string | number, boolean>;
  export let activeCell: ActiveCell;

  $: styleString = calculateRowStyle(
    style,
    columnPosition,
    isGrouped,
    !!row.__groupInfo,
  );

  $: isSelected = selected[row?.[columns?.primaryKey] as string] || false;
</script>

{#if groupData && row.__groupInfo}
  <GroupHeader style={styleString.group} {row} {groupData}/>
{/if}

<div class="row {row.__state || ''}" class:in-group={isGrouped} class:selected={isSelected}
      style={styleString.default}>
  <RowControl {index} {isGrouped} primaryKey={columns.primaryKey}
              {row} bind:selected/>

  {#each columns.data as column (column.name)}
    <Cell bind:activeCell {index} position={columnPosition.get(column.name)}
          {column} {row} on:cellUpdate/>
  {/each}
</div>
