import { IMainPage } from '../types/IMainPage';
import { ComponentEx } from '../util/ComponentEx';

import * as React from 'react';

export interface IBaseProps {
  page: IMainPage;
  active: boolean;
  onSelectOverlay: (overlay: JSX.Element) => void;
}

export interface IMainPageContext {
  globalOverlay: JSX.Element;
}

type IProps = IBaseProps;

function nop() {}

class MainPageContainer extends ComponentEx<IBaseProps, {}> {
  public static childContextTypes: React.ValidationMap<any> = {
    api: React.PropTypes.object.isRequired,
    selectOverlay: React.PropTypes.func.isRequired,
  };

  public getChildContext() {
    const { active, onSelectOverlay } = this.props;
    return {
      api: this.context.api,
      selectOverlay: active ? onSelectOverlay : nop,
    };
  }

  public render(): JSX.Element {
    const { active, page } = this.props;

    const props = page.propsFunc();

    return <div className={`main-page main-page-${active ? 'active' : 'hidden'}`}>
      <page.component {...props} active={active} />
    </div>;
  }
}

export default MainPageContainer;