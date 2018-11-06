import {
  ActionType,
  IAppState,
  INavigateToPageAction
} from "../shared/Interfaces";
import { buildState, IActionHandlerDictionary } from "../shared/Utilities";

export enum Pages {
  Unknown,
  Home,
  Pets
}

export const Navigators = {
  navigateTo: (state: IAppState, dispatch: any, page: Pages) => {
    if (state.ui.currentPage === page) {
      return;
    }

    dispatch({ type: ActionType.NavigateToPage, page });
  },
  navigateToHome: (state: IAppState, dispatch: any) => {
    Navigators.navigateTo(state, dispatch, Pages.Home);
  },
  navigateToPets: (state: IAppState, dispatch: any) => {
    Navigators.navigateTo(state, dispatch, Pages.Pets);
  }
};

export const NavigationActionHandlers: IActionHandlerDictionary = {
  sync: {
    [ActionType.NavigateToPage]: navigateToPage
  }
};

function navigateToPage(state: IAppState, action: INavigateToPageAction) {
  return buildState(state, { ui: { currentPage: action.page } });
}
