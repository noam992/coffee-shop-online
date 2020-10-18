import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

export function reducer(currentState: AppState, action: Action): AppState {

    const newState = { ...currentState }; // Spread Operator.

    switch(action.type) {

        case ActionType.LoadAllItemCart:
            newState.items = action.payload;
            break;

        case ActionType.AddItemCart: 
            newState.items.push(action.payload);
            break;

        case ActionType.DeleteItemCart:
            const index = newState.items.findIndex(p => p._id === action.payload);
            newState.items.splice(index, 1);
            break;

        case ActionType.ClearAllItemCArtCart: 
            newState.items = [];
            break;

        default: break;
    }

    return newState;
}