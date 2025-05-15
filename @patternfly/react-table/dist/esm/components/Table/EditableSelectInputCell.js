import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { Select, SelectList } from '@patternfly/react-core/dist/esm/components/Select';
import { MenuToggle } from '@patternfly/react-core/dist/esm/components/MenuToggle';
import inlineStyles from '@patternfly/react-styles/css/components/InlineEdit/inline-edit.mjs';
import formStyles from '@patternfly/react-styles/css/components/Form/form.mjs';
export const EditableSelectInputCell = ({ value, rowIndex, cellIndex, onSelect = () => { }, clearSelection, isOpen = false, isPlaceholder = false, onToggle = () => { }, selections = [''], options = [], props }) => {
    const onSelectHandler = (event, newValue) => {
        onSelect(event, newValue, rowIndex, cellIndex, isPlaceholder);
    };
    const onClear = (event) => {
        clearSelection(event, rowIndex, cellIndex);
    };
    const select = (React.createElement(Select, Object.assign({ onSelect: onSelectHandler }, (clearSelection && { onClear }), { isOpen: isOpen, selected: selections, toggle: (toggleRef) => (React.createElement(MenuToggle, { ref: toggleRef, onClick: onToggle, isExpanded: isOpen, isPlaceholder: isPlaceholder }, isOpen ? 'Expanded' : 'Collapsed')) }, props.editableSelectProps),
        React.createElement(SelectList, null, options)));
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: inlineStyles.inlineEditValue }, Array.isArray(value) ? value.join(', ') : value),
        React.createElement("div", { className: inlineStyles.inlineEditInput },
            select,
            React.createElement("div", { className: css(formStyles.formHelperText), "aria-live": "polite" }, props.errorText))));
};
EditableSelectInputCell.displayName = 'EditableSelectInputCell';
//# sourceMappingURL=EditableSelectInputCell.js.map