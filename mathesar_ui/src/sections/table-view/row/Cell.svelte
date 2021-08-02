<script lang="ts">
  import { tick, createEventDispatcher } from 'svelte';
  import type {
    TableColumn,
    TableRecord,
    ActiveCell,
  } from '@mathesar/stores/tableData';

  const dispatch = createEventDispatcher();

  export let position: { width: number; left: number } = null;
  export let column: TableColumn;
  export let row: TableRecord;
  export let index: number;
  export let activeCell: ActiveCell;

  let timer;

  $: isActive = activeCell?.rowIndex === index
    && activeCell?.column === column.name;

  let inputRef: HTMLElement;

  function cellClick(type: 'select' | 'edit') {
    activeCell = {
      rowIndex: index,
      column: column.name,
      type,
    };

    void tick().then(() => {
      inputRef?.focus();
      return null;
    });
  }

  function setValue(val: string) {
    if (row[column.name] !== val) {
      row[column.name] = val;
      // Send request
      dispatch('cellUpdate', {
        row,
        index,
        column,
      });
    }

    // Do not refresh

    // On focus out of row, or scroll
    // full reload in the next outgoing row request
  }

  function debounceAndSet(event: Event) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const val = (event.target as HTMLInputElement).value;
      setValue(val);
    }, 500);
  }

  function onBlur(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    clearTimeout(timer);
    setValue(val);
    row = { ...row };
  }
</script>

<div class="cell" class:is-active={isActive}
      class:edit-cell={isActive && activeCell?.type === 'edit'}
      style="width:{position?.width - (isActive ? 1 : 0)}px;left:{position?.left}px;">
  <div class="content" on:click={() => cellClick('select')}
    on:dblclick={() => cellClick('edit')}>
    {#if typeof row[column.name] !== 'undefined'}
      {#if row[column.name] === null}
        <span class="empty">null</span>
      {:else}
        {row[column.name]}
      {/if}
    {/if}
  </div>

  {#if isActive && activeCell?.type === 'edit'}
    <input bind:this={inputRef} type="text" class="editbox"
            value={row[column.name]?.toString() || ''}
            on:keyup={debounceAndSet} on:blur={onBlur}/>
  {/if}

  {#if !row.__state || row.__state === 'loading'}
    <div class="loading"></div>
  {/if}
</div>
