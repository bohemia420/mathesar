import type {
  ColumnPosition,
} from '@mathesar/stores/tableData';
import {
  GROUP_ROW_HEIGHT,
  GROUP_MARGIN_LEFT,
  DEFAULT_ROW_RIGHT_PADDING,
} from '@mathesar/stores/tableData';

export function calculateRowStyle(
  style: { [key: string]: string | number },
  columnPosition: ColumnPosition,
  isGrouped = false,
  isGroupHeaderRow = false,
) : {
    default?: string,
    group?: string,
  } {
  if (!style) {
    return {};
  }
  const totalWidth = columnPosition.get('__row').width;
  const left = isGrouped ? style.left as number + GROUP_MARGIN_LEFT : style.left;

  const styleStr = `position:${style.position};left:${left}px`;

  if (isGrouped && isGroupHeaderRow) {
    const top = style.top as number;
    const height = style.height as number;
    return {
      group: `${styleStr};top:${top + 25}px;height:${GROUP_ROW_HEIGHT - 25}px;`
              + `width:${totalWidth}px`,
      default: `${styleStr};top:${top + GROUP_ROW_HEIGHT}px;`
                + `height:${height - GROUP_ROW_HEIGHT}px;`
                + `width:${totalWidth + DEFAULT_ROW_RIGHT_PADDING}px`,
    };
  }

  return {
    default: `${styleStr};top:${style.top}px;height:${style.height}px;`
              + `width:${totalWidth + DEFAULT_ROW_RIGHT_PADDING}px`,
  };
}
