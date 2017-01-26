import {IEditChoice, ITableAttribute} from '../../types/ITableAttribute';
import {ComponentEx} from '../../util/ComponentEx';

import FormFeedback from '../FormFeedbackAwesome';
import FormInput from '../FormInput';

import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, ListGroup, ListGroupItem} from 'react-bootstrap';

interface ICellProps {
  language: string;
  attribute: ITableAttribute;
  rowId: string;
  rowData: any;
  rawData: any;
  t: I18next.TranslationFunction;
  onChangeData: (rowId: string, attributeId: string, value: any) => void;
}

class DetailCell extends React.Component<ICellProps, {}> {
  public render(): JSX.Element {
    const { t, attribute, rawData, rowData, rowId } = this.props;
    const value = rowData[attribute.id];

    let content: JSX.Element = null;

    if (attribute.customRenderer !== undefined) {
      content = (
        <FormControl.Static componentClass='div'>
          { attribute.customRenderer(rawData, true, t) }
        </FormControl.Static>
      );
    } else {
      if (attribute.edit.onChangeValue !== undefined) {
        if (attribute.edit.choices !== undefined) {
          const choices = attribute.edit.choices();
          const currentChoice = choices.find((choice) => choice.text === value);
          const key = currentChoice !== undefined ? currentChoice.key : undefined;
          content = (
            <FormControl
              id={attribute.id}
              componentClass='select'
              placeholder={t('No category')}
              value={key}
              onChange={this.changeCell}
            >
              {choices.map(this.renderChoice)}
            </FormControl>
          );
        } else if (attribute.edit.validate !== undefined) {
          content = (
            <FormGroup
              validationState={attribute.edit.validate(value)}
            >
              <FormInput
                id={attribute.id}
                type='text'
                label={t(attribute.name)}
                value={this.renderCell(value)}
                onChange={this.changeCell}
              />
              <FormFeedback />
            </FormGroup>
          );
        } else {
          content = (
            <FormControl
              id={attribute.id}
              type='text'
              label={t(attribute.name)}
              readOnly={false}
              value={this.renderCell(value)}
              onChange={this.changeCell}
            />
          );
        }
      } else if (Array.isArray(value)) {
        let idx = 0;
        content = (
          <ListGroup>
            {value.map((val: any) =>
                <ListGroupItem key={`${attribute.id}-${idx++}`}>{val}</ListGroupItem>)}
          </ListGroup>
        );
      } else {
        content = (
          <FormControl
            id={attribute.id}
            type='text'
            label={t(attribute.name)}
            readOnly={true}
            value={this.renderCell(value)}
          />
        );
      }
    }

    const key = `${rowId}-${attribute.id}`;

    return (
      <FormGroup key={key}>
        <ControlLabel>{attribute.name}</ControlLabel>
        {content}
      </FormGroup>
    );
  }

  private changeCell = (evt: React.FormEvent<any>) => {
    const { attribute, onChangeData, rowId } = this.props;
    onChangeData(rowId, attribute.id, evt.currentTarget.value);
  }

  private renderChoice(choice: IEditChoice): JSX.Element {
    return <option key={choice.key} value={choice.key}>{choice.text}</option>;
  }

  private renderCell(value: any): string {
    const { language } = this.props;

    if (value instanceof Date) {
      return value.toLocaleString(language);
    } else if (typeof(value) === 'string') {
      return value;
    } else if ((value === undefined) || (value === null)) {
      return '';
    } else {
      return value.toString();
    }
  }
}

export interface IDetailProps {
  language: string;
  rowId: string;
  rowData: any;
  rawData: any;
  attributes: ITableAttribute[];
  t: I18next.TranslationFunction;
}

class DetailBox extends ComponentEx<IDetailProps, {}> {
  constructor(props: IDetailProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { attributes } = this.props;
    return (
      <form style={{ minWidth: 300 }}>
      {attributes.map((obj) => this.renderDetail(obj))}
      </form>
    );
  }

  private renderDetail = (attribute: ITableAttribute) => {
    const { t, language, rawData, rowData } = this.props;

    return <DetailCell
      t={t}
      key={`detail-${rowData.__id}-${attribute.id}`}
      attribute={attribute}
      language={language}
      rowData={rowData}
      rawData={rawData}
      rowId={rowData.__id}
      onChangeData={this.onChangeData}
    />;
  }

  private onChangeData = (rowId: string, attributeId: string, value: any) => {
    this.props.attributes
    .find((attr: ITableAttribute) => attr.id === attributeId)
    .edit.onChangeValue(rowId, value);
  }
}

export default DetailBox;