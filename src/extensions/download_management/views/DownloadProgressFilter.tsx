import {IFilterProps, ITableFilter} from '../../../types/ITableAttribute';

import * as React from 'react';
import Select from 'react-select';

export class DownloadSelectionFilterComponent extends React.Component<IFilterProps, {}> {
  public render(): JSX.Element {
    const { filter } = this.props;

    const selectionFilters = [ 'Failed', 'Finished', 'In Progress'];

    const currentFilters = selectionFilters.map(current => ({
      label: current,
      value: current,
    }));

    return (
      <Select
        className='select-compact'
        options={currentFilters}
        value={filter || ''}
        onChange={this.changeFilter}
      />
    );
  }

  private changeFilter = (value: { value: string, label: string }) => {
    const { attributeId, onSetFilter } = this.props;
    onSetFilter(attributeId, value !== null ? value.value : null);
  }
}

class DownloadProgressFilter implements ITableFilter {
  public component = DownloadSelectionFilterComponent;
  public raw = false;

  public matches(filter: any, value: any): boolean {
    if (value === 'started') {
      return filter === 'In Progress';
    } else if (typeof(value) === 'string') {
      return filter.toLowerCase() === value.toLowerCase();
    } else {
      // numerical value
      return (filter === 'In Progress');
    }
  }
}

export default DownloadProgressFilter;
