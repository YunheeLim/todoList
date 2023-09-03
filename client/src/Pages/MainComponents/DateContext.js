import React, { useReducer, createContext, useRef, useState } from 'react';

let initialDate = '';

export const DateStateContext = createContext();
export const DateDispatchContext = createContext();

function dateReducer(state, action) {
    switch (action.type) {
        case 'SELECT': // 날짜 선택
            state = action.date;
            return state;
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export function DateProvider({ children }) {
    const [state, dispatch] = useReducer(dateReducer, initialDate);

    return (
        <DateStateContext.Provider value={state}>
            <DateDispatchContext.Provider value={dispatch}>
                        {children}
            </DateDispatchContext.Provider>
        </DateStateContext.Provider>
    );
}