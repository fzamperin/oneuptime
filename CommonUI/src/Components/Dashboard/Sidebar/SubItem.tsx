import React, { ReactElement, MouseEventHandler } from 'react';

export interface ComponentProps {
    title: string;
    action?: MouseEventHandler;
}

const SubItem: FunctionComponent<ComponentProps> = ({
    title,
    action,
}): ReactElement => {
    return (
        <div className="subsidebar" onClick={action}>
            {title}
        </div>
    );
};

export default SubItem;
