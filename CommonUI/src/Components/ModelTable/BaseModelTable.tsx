import BaseModel, { BaseModelType } from 'Common/Models/BaseModel';
import React, {
    MutableRefObject,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import Columns from './Columns';
import Table from '../Table/Table';
import TableColumn from '../Table/Types/Column';
import { JSONObject } from 'Common/Types/JSON';
import Card, {
    CardButtonSchema,
    ComponentProps as CardComponentProps,
} from '../Card/Card';

import RequestOptions from '../../Utils/BaseDatabase/RequestOptions';
import ListResult from '../../Utils/BaseDatabase/ListResult';
import Select from '../../Utils/BaseDatabase/Select';
import { ButtonStyleType } from '../Button/Button';
import IconProp from 'Common/Types/Icon/IconProp';
import { ModelField } from '../Forms/ModelForm';

import SortOrder from 'Common/Types/BaseDatabase/SortOrder';
import FieldType from '../Types/FieldType';
import Dictionary from 'Common/Types/Dictionary';
import ActionButtonSchema from '../ActionButton/ActionButtonSchema';
import ObjectID from 'Common/Types/ObjectID';
import ConfirmModal from '../Modal/ConfirmModal';
import Permission, {
    PermissionHelper,
    UserPermission,
} from 'Common/Types/Permission';
import PermissionUtil from '../../Utils/Permission';
import { ColumnAccessControl } from 'Common/Types/BaseDatabase/AccessControl';
import Query from '../../Utils/BaseDatabase/Query';
import Search from 'Common/Types/BaseDatabase/Search';
import Typeof from 'Common/Types/Typeof';
import Navigation from '../../Utils/Navigation';
import Route from 'Common/Types/API/Route';
import BadDataException from 'Common/Types/Exception/BadDataException';
import List from '../List/List';
import OrderedStatesList from '../OrderedStatesList/OrderedStatesList';
import Field from '../Detail/Field';
import FormValues from '../Forms/Types/FormValues';
import { FilterData } from '../Table/Filter';
import ModelTableColumn from './Column';
import { Logger } from '../../Utils/Logger';
import { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import InBetween from 'Common/Types/BaseDatabase/InBetween';
import { API_DOCS_URL, BILLING_ENABLED, getAllEnvVars } from '../../Config';
import SubscriptionPlan, {
    PlanSelect,
} from 'Common/Types/Billing/SubscriptionPlan';
import Pill from '../Pill/Pill';
import { Yellow } from 'Common/Types/BrandColors';
import { ModalWidth } from '../Modal/Modal';
import ProjectUtil from '../../Utils/Project';
import API from '../../Utils/API/API';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { DropdownOption } from '../Dropdown/Dropdown';
import { FormStep } from '../Forms/Types/FormStep';
import URL from 'Common/Types/API/URL';
import { ListDetailProps } from '../List/ListRow';
import User from '../../Utils/User';
import AnalyticsBaseModel, {
    AnalyticsBaseModelType,
} from 'Common/AnalyticsModels/BaseModel';
import Sort from '../../Utils/BaseDatabase/Sort';
import { FormProps } from '../Forms/BasicForm';
import {
    PromiseVoidFunction,
    ErrorFunction,
    VoidFunction,
} from 'Common/Types/FunctionTypes';
import { GetReactElementFunction } from '../../Types/FunctionTypes';
import SelectEntityField from '../../Types/SelectEntityField';

export enum ShowTableAs {
    Table,
    List,
    OrderedStatesList,
}

export interface BaseTableCallbacks<
    TBaseModel extends BaseModel | AnalyticsBaseModel
> {
    deleteItem: (item: TBaseModel) => Promise<void>;
    getModelFromJSON: (item: JSONObject) => TBaseModel;
    getJSONFromModel: (item: TBaseModel) => JSONObject;
    addSlugToSelect: (select: Select<TBaseModel>) => Select<TBaseModel>;
    getList: (data: {
        modelType: BaseModelType | AnalyticsBaseModelType;
        query: Query<TBaseModel>;
        limit: number;
        skip: number;
        sort: Sort<TBaseModel>;
        select: Select<TBaseModel>;
        requestOptions?: RequestOptions | undefined;
    }) => Promise<ListResult<TBaseModel>>;
    toJSONArray: (data: Array<TBaseModel>) => Array<JSONObject>;
    updateById: (data: { id: ObjectID; data: JSONObject }) => Promise<void>;
    showCreateEditModal: (data: {
        modalType: ModalType;
        modelIdToEdit?: ObjectID | undefined;
        onBeforeCreate?:
            | ((
                  item: TBaseModel,
                  miscDataProps: JSONObject
              ) => Promise<TBaseModel>)
            | undefined;
        onSuccess?: ((item: TBaseModel) => void) | undefined;
        onClose?: (() => void) | undefined;
    }) => ReactElement;
}

export interface BaseTableProps<
    TBaseModel extends BaseModel | AnalyticsBaseModel
> {
    modelType: { new (): TBaseModel };
    id: string;
    onFetchInit?:
        | undefined
        | ((pageNumber: number, itemsOnPage: number) => void);
    onFetchSuccess?:
        | undefined
        | ((data: Array<TBaseModel>, totalCount: number) => void);
    cardProps?: CardComponentProps | undefined;
    showCreateForm?: undefined | boolean;
    columns: Columns<TBaseModel>;
    listDetailOptions?: undefined | ListDetailProps;
    selectMoreFields?: Select<TBaseModel>;
    initialItemsOnPage?: number;
    isDeleteable: boolean;
    isEditable?: boolean | undefined;
    isCreateable: boolean;
    disablePagination?: undefined | boolean;
    formFields?: undefined | Array<ModelField<TBaseModel>>;
    formSteps?: undefined | Array<FormStep<TBaseModel>>;
    noItemsMessage?: undefined | string;
    showRefreshButton?: undefined | boolean;
    showFilterButton?: undefined | boolean;
    isViewable?: undefined | boolean;
    showViewIdButton?: undefined | boolean;
    enableDragAndDrop?: boolean | undefined;
    viewPageRoute?: undefined | Route;
    onViewPage?: (item: TBaseModel) => Promise<Route>;
    query?: Query<TBaseModel>;
    onBeforeFetch?: (() => Promise<JSONObject>) | undefined;
    createInitialValues?: FormValues<TBaseModel> | undefined;
    onBeforeCreate?:
        | ((item: TBaseModel, miscDataProps: JSONObject) => Promise<TBaseModel>)
        | undefined;
    onCreateSuccess?: ((item: TBaseModel) => Promise<TBaseModel>) | undefined;
    createVerb?: string;
    showTableAs?: ShowTableAs | undefined;
    singularName?: string | undefined;
    pluralName?: string | undefined;
    actionButtons?: Array<ActionButtonSchema> | undefined;
    deleteButtonText?: string | undefined;
    onCreateEditModalClose?: (() => void) | undefined;
    editButtonText?: string | undefined;
    viewButtonText?: string | undefined;
    refreshToggle?: boolean | undefined;
    fetchRequestOptions?: RequestOptions | undefined;
    deleteRequestOptions?: RequestOptions | undefined;
    onItemDeleted?: ((item: TBaseModel) => void) | undefined;
    onBeforeEdit?: ((item: TBaseModel) => Promise<TBaseModel>) | undefined;
    onBeforeDelete?: ((item: TBaseModel) => Promise<TBaseModel>) | undefined;
    onBeforeView?: ((item: TBaseModel) => Promise<TBaseModel>) | undefined;
    sortBy?: string | undefined;
    sortOrder?: SortOrder | undefined;
    dragDropIdField?: string | undefined;
    dragDropIndexField?: string | undefined;
    createEditModalWidth?: ModalWidth | undefined;
    orderedStatesListProps?: {
        titleField: string;
        descriptionField?: string | undefined;
        orderField: string;
        shouldAddItemInTheEnd?: boolean;
        shouldAddItemInTheBeginning?: boolean;
    };
    onViewComplete?: ((item: TBaseModel) => void) | undefined;
    createEditFromRef?:
        | undefined
        | MutableRefObject<FormProps<FormValues<TBaseModel>>>;
    name: string;
}

export interface ComponentProps<
    TBaseModel extends BaseModel | AnalyticsBaseModel
> extends BaseTableProps<TBaseModel> {
    callbacks: BaseTableCallbacks<TBaseModel>;
}

export enum ModalType {
    Create,
    Edit,
}

const BaseModelTable: <TBaseModel extends BaseModel | AnalyticsBaseModel>(
    props: ComponentProps<TBaseModel>
) => ReactElement = <TBaseModel extends BaseModel | AnalyticsBaseModel>(
    props: ComponentProps<TBaseModel>
): ReactElement => {
    const model: TBaseModel = new props.modelType();

    let showTableAs: ShowTableAs | undefined = props.showTableAs;

    if (!showTableAs) {
        showTableAs = ShowTableAs.Table;
    }

    const [showViewIdModal, setShowViewIdModal] = useState<boolean>(false);
    const [viewId, setViewId] = useState<string | null>(null);
    const [tableColumns, setColumns] = useState<Array<TableColumn>>([]);
    const [cardButtons, setCardButtons] = useState<Array<CardButtonSchema>>([]);

    const [actionButtonSchema, setActionButtonSchema] = useState<
        Array<ActionButtonSchema>
    >([]);

    useEffect(() => {
        if (props.showCreateForm) {
            setShowModal(true);
            setModalType(ModalType.Create);
        }
    }, [props.showCreateForm]);

    const [orderedStatesListNewItemOrder, setOrderedStatesListNewItemOrder] =
        useState<number | null>(null);

    const [onBeforeFetchData, setOnBeforeFetchData] = useState<
        JSONObject | undefined
    >(undefined);
    const [data, setData] = useState<Array<TBaseModel>>([]);
    const [query, setQuery] = useState<Query<TBaseModel>>({});
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [totalItemsCount, setTotalItemsCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [error, setError] = useState<string>('');
    const [tableFilterError, setTableFilterError] = useState<string>('');

    const [showModel, setShowModal] = useState<boolean>(false);
    const [showTableFilter, setShowTableFilter] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.Create);
    const [sortBy, setSortBy] = useState<string>(props.sortBy || '');
    const [sortOrder, setSortOrder] = useState<SortOrder>(
        props.sortOrder || SortOrder.Ascending
    );
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
        useState<boolean>(false);
    const [currentEditableItem, setCurrentEditableItem] =
        useState<JSONObject | null>(null);
    const [currentDeleteableItem, setCurrentDeleteableItem] =
        useState<JSONObject | null>(null);

    const [itemsOnPage, setItemsOnPage] = useState<number>(
        props.initialItemsOnPage || 10
    );

    const [fields, setFields] = useState<Array<Field>>([]);

    const [isTableFilterFetchLoading, setIsTableFilterFetchLoading] =
        useState(false);

    const [errorModalText, setErrorModalText] = useState<string>('');

    useEffect(() => {
        if (!showModel) {
            props.onCreateEditModalClose && props.onCreateEditModalClose();
        }
    }, [showModel]);

    useEffect(() => {
        const detailFields: Array<Field> = [];
        for (const column of tableColumns) {
            if (!column.key) {
                // if its an action column, ignore.
                continue;
            }

            detailFields.push({
                title: column.title,
                description: column.description || '',
                key: column.key || '',
                fieldType: column.type,
                colSpan: column.colSpan,
                contentClassName: column.contentClassName,
                alignItem: column.alignItem,
                getElement: column.getElement
                    ? (item: JSONObject): ReactElement => {
                          return column.getElement!(item, onBeforeFetchData);
                      }
                    : undefined,
            });

            setFields(detailFields);
        }
    }, [tableColumns]);

    type GetRelationSelectFunction = () => Select<TBaseModel>;

    const getRelationSelect: GetRelationSelectFunction =
        (): Select<TBaseModel> => {
            const relationSelect: Select<TBaseModel> = {};

            for (const column of props.columns || []) {
                const key: string | null = column.field
                    ? (Object.keys(column.field)[0] as string)
                    : null;

                if (key && model.isFileColumn(key)) {
                    (relationSelect as JSONObject)[key] = {
                        file: true,
                        _id: true,
                        type: true,
                        name: true,
                    };
                } else if (key && model.isEntityColumn(key)) {
                    if (!(relationSelect as JSONObject)[key]) {
                        (relationSelect as JSONObject)[key] = {};
                    }

                    (relationSelect as JSONObject)[key] = {
                        ...((relationSelect as JSONObject)[key] as JSONObject),
                        ...(column.field as any)[key],
                    };
                }
            }

            return relationSelect;
        };

    type DeleteItemFunction = (item: TBaseModel) => Promise<void>;

    const deleteItem: DeleteItemFunction = async (item: TBaseModel) => {
        if (!item.id) {
            throw new BadDataException('item.id cannot be null');
        }

        setIsLoading(true);

        try {
            await props.callbacks.deleteItem(item);

            props.onItemDeleted && props.onItemDeleted(item);

            if (data.length === 1 && currentPageNumber > 1) {
                setCurrentPageNumber(currentPageNumber - 1);
            }
            await fetchItems();
        } catch (err) {
            setErrorModalText(API.getFriendlyMessage(err));
        }

        setIsLoading(false);
    };

    const serializeToTableColumns: VoidFunction = (): void => {
        // Convert ModelColumns to TableColumns.

        const columns: Array<TableColumn> = [];

        let selectFields: Select<TBaseModel> = {
            _id: true,
        };

        selectFields = props.callbacks.addSlugToSelect(selectFields);

        const userPermissions: Array<Permission> = getUserPermissions();

        const accessControl: Dictionary<ColumnAccessControl> =
            model.getColumnAccessControlForAllColumns();

        for (const column of props.columns || []) {
            const hasPermission: boolean =
                hasPermissionToReadColumn(column) || User.isMasterAdmin();
            const key: string | null = getColumnKey(column);

            if (hasPermission) {
                let tooltipText: ((item: JSONObject) => string) | undefined =
                    undefined;

                if (column.tooltipText) {
                    tooltipText = (item: JSONObject): string => {
                        return column.tooltipText!(
                            props.callbacks.getModelFromJSON(item)
                        );
                    };
                }

                // get filter options if they were already loaded.

                let filterDropdownOptions: Array<DropdownOption> | undefined =
                    undefined;

                const columnKey: string | null = column.selectedProperty
                    ? key + '.' + column.selectedProperty
                    : key;

                const existingTableColumn: TableColumn | undefined =
                    tableColumns.find((i: TableColumn) => {
                        return i.key === columnKey;
                    });

                if (column.filterDropdownOptions) {
                    filterDropdownOptions = column.filterDropdownOptions;
                }

                if (
                    tableColumns &&
                    existingTableColumn &&
                    existingTableColumn.filterDropdownOptions
                ) {
                    filterDropdownOptions =
                        existingTableColumn.filterDropdownOptions;
                }

                columns.push({
                    ...column,
                    disableSort: column.disableSort || shouldDisableSort(key),
                    key: columnKey,
                    tooltipText,
                    filterDropdownOptions: filterDropdownOptions,
                });

                if (key) {
                    (selectFields as Dictionary<boolean>)[key] = true;
                }
            }
        }

        const selectMoreFields: Array<string> = props.selectMoreFields
            ? Object.keys(props.selectMoreFields)
            : [];

        for (const moreField of selectMoreFields) {
            let hasPermissionToSelectField: boolean = true;
            let fieldPermissions: Array<Permission> = [];
            fieldPermissions = accessControl[moreField as string]?.read || [];

            if (
                accessControl[moreField]?.read &&
                !PermissionHelper.doesPermissionsIntersect(
                    userPermissions,
                    fieldPermissions
                )
            ) {
                hasPermissionToSelectField = false;
            }

            if (hasPermissionToSelectField) {
                (selectFields as Dictionary<boolean>)[moreField] = true;
            } else {
                Logger.warn(
                    'User does not have read permissions to read - ' + moreField
                );
            }
        }

        const permissions: Array<Permission> | null =
            PermissionUtil.getAllPermissions();

        if (
            (permissions &&
                ((props.isDeleteable &&
                    model.hasDeletePermissions(permissions)) ||
                    (props.isEditable &&
                        model.hasUpdatePermissions(permissions)) ||
                    (props.isViewable &&
                        model.hasReadPermissions(permissions)))) ||
            (props.actionButtons && props.actionButtons.length > 0) ||
            props.showViewIdButton
        ) {
            columns.push({
                title: 'Actions',
                type: FieldType.Actions,
            });
        }

        setActionSchema();
        setHeaderButtons();

        setColumns(columns);
    };

    const getFilterDropdownItems: PromiseVoidFunction =
        async (): Promise<void> => {
            setTableFilterError('');
            setIsTableFilterFetchLoading(true);

            const classicColumns: Array<TableColumn> = [...tableColumns];

            try {
                for (const column of props.columns) {
                    const key: string | null = getColumnKey(column);

                    const classicColumn: TableColumn | undefined =
                        classicColumns.find((i: TableColumn) => {
                            return i.key === key;
                        });

                    if (!classicColumn) {
                        continue;
                    }

                    if (!key) {
                        continue;
                    }

                    if (!column.filterEntityType) {
                        continue;
                    }

                    if (!column.isFilterable) {
                        continue;
                    }

                    if (!column.filterDropdownField) {
                        Logger.warn(
                            `Cannot filter on ${key} because column.dropdownField is not set.`
                        );
                        continue;
                    }

                    const hasPermission: boolean =
                        hasPermissionToReadColumn(column);

                    if (!hasPermission) {
                        continue;
                    }

                    const query: Query<TBaseModel> = column.filterQuery || {};

                    const listResult: ListResult<TBaseModel> =
                        await props.callbacks.getList({
                            modelType: column.filterEntityType,
                            query: query,
                            limit: LIMIT_PER_PROJECT,
                            skip: 0,
                            select: {
                                [column.filterDropdownField.label]: true,
                                [column.filterDropdownField.value]: true,
                            } as any,
                            sort: {},
                        });

                    classicColumn.filterDropdownOptions = [];
                    for (const item of listResult.data) {
                        classicColumn.filterDropdownOptions.push({
                            value: item.getColumnValue(
                                column.filterDropdownField.value
                            ) as string,
                            label: item.getColumnValue(
                                column.filterDropdownField.label
                            ) as string,
                        });
                    }

                    if (column.tooltipText) {
                        classicColumn.tooltipText = (
                            item: JSONObject
                        ): string => {
                            return column.tooltipText!(
                                props.callbacks.getModelFromJSON(item)
                            );
                        };
                    }

                    classicColumn.colSpan = column.colSpan;
                    classicColumn.alignItem = column.alignItem;
                    classicColumn.contentClassName = column.contentClassName;
                }

                setColumns(classicColumns);
            } catch (err) {
                setTableFilterError(API.getFriendlyMessage(err));
            }

            setIsTableFilterFetchLoading(false);
        };

    const fetchItems: PromiseVoidFunction = async (): Promise<void> => {
        setError('');
        setIsLoading(true);

        if (props.onFetchInit) {
            props.onFetchInit(currentPageNumber, itemsOnPage);
        }

        if (props.onBeforeFetch) {
            const jobject: JSONObject = await props.onBeforeFetch();
            setOnBeforeFetchData(jobject);
        }

        try {
            const listResult: ListResult<TBaseModel> =
                await props.callbacks.getList({
                    modelType: props.modelType as
                        | BaseModelType
                        | AnalyticsBaseModelType,
                    query: {
                        ...query,
                        ...props.query,
                    },
                    limit: itemsOnPage,
                    skip: (currentPageNumber - 1) * itemsOnPage,
                    select: {
                        ...getSelect(),
                        ...getRelationSelect(),
                    },
                    sort: sortBy
                        ? {
                              [sortBy as any]: sortOrder,
                          }
                        : {},
                    requestOptions: props.fetchRequestOptions,
                });

            setTotalItemsCount(listResult.count);
            setData(listResult.data);
        } catch (err) {
            setError(API.getFriendlyMessage(err));
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (showTableFilter) {
            getFilterDropdownItems().catch((err: Error) => {
                setTableFilterError(API.getFriendlyMessage(err));
            });
        }
    }, [showTableFilter]);

    type GetSelectFunction = () => Select<TBaseModel>;

    const getSelect: GetSelectFunction = (): Select<TBaseModel> => {
        const selectFields: Select<TBaseModel> = {
            _id: true,
        };

        for (const column of props.columns || []) {
            const key: string | null = column.field
                ? (Object.keys(column.field)[0] as string)
                : null;

            if (key) {
                if (model.hasColumn(key)) {
                    (selectFields as Dictionary<boolean>)[key] = true;
                } else {
                    throw new BadDataException(
                        `${key} column not found on ${model.singularName}`
                    );
                }
            }
        }

        const selectMoreFields: Array<string> = props.selectMoreFields
            ? Object.keys(props.selectMoreFields)
            : [];

        if (props.dragDropIndexField) {
            selectMoreFields.push(props.dragDropIndexField);
        }

        if (
            props.dragDropIdField &&
            !Object.keys(selectFields).includes(props.dragDropIdField) &&
            !selectMoreFields.includes(props.dragDropIdField)
        ) {
            selectMoreFields.push(props.dragDropIdField);
        }

        for (const moreField of selectMoreFields) {
            if (model.hasColumn(moreField) && model.isEntityColumn(moreField)) {
                (selectFields as Dictionary<boolean>)[moreField] = (
                    props.selectMoreFields as any
                )[moreField];
            } else if (model.hasColumn(moreField)) {
                (selectFields as Dictionary<boolean>)[moreField] = true;
            } else {
                throw new BadDataException(
                    `${moreField} column not found on ${model.singularName}`
                );
            }
        }

        return selectFields;
    };

    const setHeaderButtons: VoidFunction = (): void => {
        // add header buttons.
        let headerbuttons: Array<CardButtonSchema> = [];

        if (props.cardProps?.buttons && props.cardProps?.buttons.length > 0) {
            headerbuttons = [...props.cardProps.buttons];
        }

        const permissions: Array<Permission> | null =
            PermissionUtil.getAllPermissions();

        let hasPermissionToCreate: boolean = false;

        if (permissions) {
            hasPermissionToCreate =
                model.hasCreatePermissions(permissions) || User.isMasterAdmin();
        }

        // because ordered list add button is inside the table and not on the card header.
        if (
            props.isCreateable &&
            hasPermissionToCreate &&
            showTableAs !== ShowTableAs.OrderedStatesList
        ) {
            headerbuttons.push({
                title: `${props.createVerb || 'Create'} ${
                    props.singularName || model.singularName
                }`,
                buttonStyle: ButtonStyleType.NORMAL,
                className:
                    props.showFilterButton || props.showRefreshButton
                        ? 'mr-1'
                        : '',
                onClick: () => {
                    setModalType(ModalType.Create);
                    setShowModal(true);
                },
                icon: IconProp.Add,
            });
        }

        if (props.showRefreshButton) {
            headerbuttons.push({
                title: '',
                className: props.showFilterButton
                    ? 'p-1 px-1 pr-0 pl-0 py-0 mt-1'
                    : 'py-0 pr-0 pl-1 mt-1',
                buttonStyle: ButtonStyleType.ICON,
                onClick: async () => {
                    await fetchItems();
                },
                disabled: isTableFilterFetchLoading,
                icon: IconProp.Refresh,
            });
        }

        if (props.showFilterButton) {
            headerbuttons.push({
                title: '',
                buttonStyle: ButtonStyleType.ICON,
                className: props.showRefreshButton
                    ? 'p-1 px-1 pr-0 pl-0 py-0 mt-1'
                    : 'py-0 pr-0 pl-1 mt-1',
                onClick: () => {
                    const newValue: boolean = !showTableFilter;

                    setQuery({});

                    setShowTableFilter(newValue);
                },
                disabled: isTableFilterFetchLoading,
                icon: IconProp.Filter,
            });
        }

        setCardButtons(headerbuttons);
    };

    useEffect(() => {
        fetchItems().catch((err: Error) => {
            setError(API.getFriendlyMessage(err));
        });
    }, [
        currentPageNumber,
        sortBy,
        sortOrder,
        itemsOnPage,
        query,
        props.refreshToggle,
    ]);

    type ShouldDisableSortFunction = (columnName: string | null) => boolean;

    const shouldDisableSort: ShouldDisableSortFunction = (
        columnName: string | null
    ): boolean => {
        if (!columnName) {
            return true;
        }

        return model.isEntityColumn(columnName);
    };

    type GetColumnKeyFunction = (
        column: ModelTableColumn<TBaseModel>
    ) => string | null;

    const getColumnKey: GetColumnKeyFunction = (
        column: ModelTableColumn<TBaseModel>
    ): string | null => {
        const key: string | null = column.field
            ? (Object.keys(column.field)[0] as string)
            : null;

        return key;
    };

    type HasPermissionToReadColumnFunction = (
        column: ModelTableColumn<TBaseModel>
    ) => boolean;

    const hasPermissionToReadColumn: HasPermissionToReadColumnFunction = (
        column: ModelTableColumn<TBaseModel>
    ): boolean => {
        const accessControl: Dictionary<ColumnAccessControl> =
            model.getColumnAccessControlForAllColumns();

        const userPermissions: Array<Permission> = getUserPermissions();

        const key: string | null = getColumnKey(column);

        // check permissions.
        let hasPermission: boolean = false;

        if (!key) {
            hasPermission = true;
        }

        if (key) {
            hasPermission = true;
            let fieldPermissions: Array<Permission> = [];
            fieldPermissions = accessControl[key as string]?.read || [];

            if (
                accessControl[key]?.read &&
                !PermissionHelper.doesPermissionsIntersect(
                    userPermissions,
                    fieldPermissions
                )
            ) {
                hasPermission = false;
            }
        }

        return hasPermission;
    };

    type GetUserPermissionsFunction = () => Array<Permission>;

    const getUserPermissions: GetUserPermissionsFunction =
        (): Array<Permission> => {
            let userPermissions: Array<Permission> =
                PermissionUtil.getGlobalPermissions()?.globalPermissions || [];
            if (
                PermissionUtil.getProjectPermissions() &&
                PermissionUtil.getProjectPermissions()?.permissions &&
                PermissionUtil.getProjectPermissions()!.permissions.length > 0
            ) {
                userPermissions = userPermissions.concat(
                    PermissionUtil.getProjectPermissions()!.permissions.map(
                        (i: UserPermission) => {
                            return i.permission;
                        }
                    )
                );
            }

            userPermissions.push(Permission.Public);

            return userPermissions;
        };

    useEffect(() => {
        serializeToTableColumns();
    }, []);

    useEffect(() => {
        serializeToTableColumns();
    }, [data]);

    const setActionSchema: VoidFunction = () => {
        const permissions: Array<Permission> =
            PermissionUtil.getAllPermissions();

        const actionsSchema: Array<ActionButtonSchema> = [];

        if (props.showViewIdButton) {
            actionsSchema.push({
                title: 'Show ID',
                buttonStyleType: ButtonStyleType.OUTLINE,
                onClick: async (
                    item: JSONObject,
                    onCompleteAction: VoidFunction,
                    onError: ErrorFunction
                ) => {
                    try {
                        setViewId(item['_id'] as string);
                        setShowViewIdModal(true);
                        onCompleteAction();
                    } catch (err) {
                        onError(err as Error);
                    }
                },
            });
        }

        // add actions buttons from props.
        if (props.actionButtons) {
            for (const moreSchema of props.actionButtons) {
                actionsSchema.push(moreSchema);
            }
        }

        if (permissions) {
            if (
                props.isViewable &&
                (model.hasReadPermissions(permissions) || User.isMasterAdmin())
            ) {
                actionsSchema.push({
                    title:
                        props.viewButtonText ||
                        `View ${props.singularName || model.singularName}`,
                    buttonStyleType: ButtonStyleType.NORMAL,
                    onClick: async (
                        item: JSONObject,
                        onCompleteAction: VoidFunction,
                        onError: ErrorFunction
                    ) => {
                        try {
                            const baseModel: TBaseModel =
                                props.callbacks.getModelFromJSON(item);

                            if (props.onBeforeView) {
                                item = props.callbacks.getJSONFromModel(
                                    await props.onBeforeView(baseModel)
                                );
                            }

                            if (props.onViewPage) {
                                const route: Route = await props.onViewPage(
                                    baseModel
                                );

                                onCompleteAction();

                                if (props.onViewComplete) {
                                    props.onViewComplete(baseModel);
                                }

                                return Navigation.navigate(route);
                            }

                            if (!props.viewPageRoute) {
                                throw new BadDataException(
                                    'props.viewPageRoute not found'
                                );
                            }

                            onCompleteAction();
                            if (props.onViewComplete) {
                                props.onViewComplete(baseModel);
                            }

                            const id: string = baseModel.id?.toString() || '';

                            return Navigation.navigate(
                                new Route(
                                    props.viewPageRoute.toString()
                                ).addRoute('/' + id)
                            );
                        } catch (err) {
                            onError(err as Error);
                        }
                    },
                });
            }

            if (props.isEditable && model.hasUpdatePermissions(permissions)) {
                actionsSchema.push({
                    title: props.editButtonText || 'Edit',
                    buttonStyleType: ButtonStyleType.OUTLINE,
                    onClick: async (
                        item: JSONObject,
                        onCompleteAction: VoidFunction,
                        onError: ErrorFunction
                    ) => {
                        try {
                            if (props.onBeforeEdit) {
                                item = props.callbacks.getJSONFromModel(
                                    await props.onBeforeEdit(
                                        props.callbacks.getModelFromJSON(item)
                                    )
                                );
                            }

                            setModalType(ModalType.Edit);
                            setShowModal(true);
                            setCurrentEditableItem(item);

                            onCompleteAction();
                        } catch (err) {
                            onError(err as Error);
                        }
                    },
                });
            }

            if (props.isDeleteable && model.hasDeletePermissions(permissions)) {
                actionsSchema.push({
                    title: props.deleteButtonText || 'Delete',
                    icon: IconProp.Trash,
                    buttonStyleType: ButtonStyleType.DANGER_OUTLINE,
                    onClick: async (
                        item: JSONObject,
                        onCompleteAction: VoidFunction,
                        onError: ErrorFunction
                    ) => {
                        try {
                            if (props.onBeforeDelete) {
                                item = props.callbacks.getJSONFromModel(
                                    await props.onBeforeDelete(
                                        props.callbacks.getModelFromJSON(item)
                                    )
                                );
                            }

                            setShowDeleteConfirmModal(true);
                            setCurrentDeleteableItem(item);
                            onCompleteAction();
                        } catch (err) {
                            onError(err as Error);
                        }
                    },
                });
            }
        }

        setActionButtonSchema(actionsSchema);
    };

    const getTable: GetReactElementFunction = (): ReactElement => {
        return (
            <Table
                onFilterChanged={(filterData: FilterData) => {
                    const newQuery: Query<TBaseModel> = {};

                    for (const key in filterData) {
                        if (
                            filterData[key] &&
                            typeof filterData[key] === Typeof.String
                        ) {
                            newQuery[key as keyof TBaseModel] = (
                                filterData[key] || ''
                            ).toString();
                        }

                        if (typeof filterData[key] === Typeof.Boolean) {
                            newQuery[key as keyof TBaseModel] = Boolean(
                                filterData[key]
                            );
                        }

                        if (filterData[key] instanceof Date) {
                            newQuery[key as keyof TBaseModel] = filterData[key];
                        }

                        if (filterData[key] instanceof Search) {
                            newQuery[key as keyof TBaseModel] = filterData[key];
                        }

                        if (filterData[key] instanceof InBetween) {
                            newQuery[key as keyof TBaseModel] = filterData[key];
                        }

                        if (Array.isArray(filterData[key])) {
                            newQuery[key as keyof TBaseModel] = filterData[key];
                        }
                    }

                    setQuery(newQuery);
                }}
                onSortChanged={(sortBy: string, sortOrder: SortOrder) => {
                    setSortBy(sortBy);
                    setSortOrder(sortOrder);
                }}
                onTableFilterRefreshClick={async () => {
                    await getFilterDropdownItems();
                }}
                singularLabel={
                    props.singularName || model.singularName || 'Item'
                }
                pluralLabel={props.pluralName || model.pluralName || 'Items'}
                error={error}
                currentPageNumber={currentPageNumber}
                isLoading={isLoading}
                enableDragAndDrop={props.enableDragAndDrop}
                dragDropIdField={'_id'}
                dragDropIndexField={props.dragDropIndexField}
                totalItemsCount={totalItemsCount}
                data={props.callbacks.toJSONArray(data)}
                filterError={tableFilterError}
                id={props.id}
                columns={tableColumns}
                itemsOnPage={itemsOnPage}
                onDragDrop={async (id: string, newOrder: number) => {
                    if (!props.dragDropIndexField) {
                        return;
                    }

                    setIsLoading(true);

                    await props.callbacks.updateById({
                        id: new ObjectID(id),
                        data: {
                            [props.dragDropIndexField]: newOrder,
                        },
                    });

                    await fetchItems();
                }}
                disablePagination={props.disablePagination || false}
                isTableFilterLoading={isTableFilterFetchLoading}
                onNavigateToPage={async (
                    pageNumber: number,
                    itemsOnPage: number
                ) => {
                    setCurrentPageNumber(pageNumber);
                    setItemsOnPage(itemsOnPage);
                }}
                showFilter={showTableFilter}
                noItemsMessage={props.noItemsMessage || ''}
                onRefreshClick={async () => {
                    await fetchItems();
                }}
                actionButtons={actionButtonSchema}
            />
        );
    };

    const getOrderedStatesList: GetReactElementFunction = (): ReactElement => {
        if (!props.orderedStatesListProps) {
            throw new BadDataException(
                'props.orderedStatesListProps required when showTableAs === ShowTableAs.OrderedStatesList'
            );
        }

        let getTitleElement:
            | ((
                  item: JSONObject,
                  onBeforeFetchData?: JSONObject | undefined
              ) => ReactElement)
            | undefined = undefined;
        let getDescriptionElement:
            | ((item: JSONObject) => ReactElement)
            | undefined = undefined;

        for (const column of props.columns) {
            const key: string | undefined = Object.keys(
                column.field as SelectEntityField<TBaseModel>
            )[0];

            if (key === props.orderedStatesListProps.titleField) {
                getTitleElement = column.getElement;
            }

            if (key === props.orderedStatesListProps.descriptionField) {
                getDescriptionElement = column.getElement;
            }
        }

        return (
            <OrderedStatesList
                error={error}
                isLoading={isLoading}
                data={props.callbacks.toJSONArray(data)}
                id={props.id}
                titleField={props.orderedStatesListProps?.titleField || ''}
                descriptionField={
                    props.orderedStatesListProps?.descriptionField || ''
                }
                orderField={props.orderedStatesListProps?.orderField || ''}
                shouldAddItemInTheBeginning={
                    props.orderedStatesListProps.shouldAddItemInTheBeginning
                }
                shouldAddItemInTheEnd={
                    props.orderedStatesListProps.shouldAddItemInTheEnd
                }
                noItemsMessage={props.noItemsMessage || ''}
                onRefreshClick={async () => {
                    await fetchItems();
                }}
                onCreateNewItem={
                    props.isCreateable
                        ? (order: number) => {
                              setOrderedStatesListNewItemOrder(order);
                              setModalType(ModalType.Create);
                              setShowModal(true);
                          }
                        : undefined
                }
                singularLabel={
                    props.singularName || model.singularName || 'Item'
                }
                actionButtons={actionButtonSchema}
                getTitleElement={getTitleElement}
                getDescriptionElement={getDescriptionElement}
            />
        );
    };

    const getList: GetReactElementFunction = (): ReactElement => {
        return (
            <List
                singularLabel={
                    props.singularName || model.singularName || 'Item'
                }
                pluralLabel={props.pluralName || model.pluralName || 'Items'}
                error={error}
                currentPageNumber={currentPageNumber}
                listDetailOptions={props.listDetailOptions}
                enableDragAndDrop={props.enableDragAndDrop}
                onDragDrop={async (id: string, newOrder: number) => {
                    if (!props.dragDropIndexField) {
                        return;
                    }

                    setIsLoading(true);

                    await props.callbacks.updateById({
                        id: new ObjectID(id),
                        data: {
                            [props.dragDropIndexField]: newOrder,
                        },
                    });

                    await fetchItems();
                }}
                dragDropIdField={'_id'}
                dragDropIndexField={props.dragDropIndexField}
                isLoading={isLoading}
                totalItemsCount={totalItemsCount}
                data={props.callbacks.toJSONArray(data)}
                id={props.id}
                fields={fields}
                itemsOnPage={itemsOnPage}
                disablePagination={props.disablePagination || false}
                onNavigateToPage={async (
                    pageNumber: number,
                    itemsOnPage: number
                ) => {
                    setCurrentPageNumber(pageNumber);
                    setItemsOnPage(itemsOnPage);
                }}
                noItemsMessage={props.noItemsMessage || ''}
                onRefreshClick={async () => {
                    await fetchItems();
                }}
                actionButtons={actionButtonSchema}
            />
        );
    };

    type GetCardTitleFunction = (title: ReactElement | string) => ReactElement;

    const getCardTitle: GetCardTitleFunction = (
        title: ReactElement | string
    ): ReactElement => {
        const plan: PlanSelect | null = ProjectUtil.getCurrentPlan();

        let showPlan: boolean = Boolean(
            BILLING_ENABLED &&
                plan &&
                new props.modelType().getReadBillingPlan() &&
                !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                    new props.modelType().getReadBillingPlan()!,
                    plan,
                    getAllEnvVars()
                )
        );

        let planName: string = new props.modelType().getReadBillingPlan()!;

        if (props.isCreateable && !showPlan) {
            // if createable then read create billing permissions.
            showPlan = Boolean(
                BILLING_ENABLED &&
                    plan &&
                    new props.modelType().getCreateBillingPlan() &&
                    !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                        new props.modelType().getCreateBillingPlan()!,
                        plan,
                        getAllEnvVars()
                    )
            );

            planName = new props.modelType().getCreateBillingPlan()!;
        }

        return (
            <span>
                {title}
                {showPlan && (
                    <span
                        style={{
                            marginLeft: '5px',
                        }}
                    >
                        <Pill text={`${planName} Plan`} color={Yellow} />
                    </span>
                )}
            </span>
        );
    };

    const getCardComponent: GetReactElementFunction = (): ReactElement => {
        if (showTableAs === ShowTableAs.List) {
            return (
                <div>
                    {props.cardProps && (
                        <Card
                            bodyClassName="-ml-6 -mr-6 bg-gray-50 border-top"
                            {...props.cardProps}
                            buttons={cardButtons}
                            title={getCardTitle(props.cardProps.title)}
                        >
                            <div className="mt-6 border-t border-gray-200">
                                <div className="ml-6 mr-6  pt-6">
                                    {tableColumns.length === 0 &&
                                        props.columns.length > 0 && (
                                            <ErrorMessage
                                                error={`You are not authorized to view this list. You need any one of these permissions: ${PermissionHelper.getPermissionTitles(
                                                    model.getReadPermissions()
                                                ).join(', ')}`}
                                            />
                                        )}
                                    {!(
                                        tableColumns.length === 0 &&
                                        props.columns.length > 0
                                    ) && getList()}
                                </div>
                            </div>
                        </Card>
                    )}

                    {!props.cardProps && getList()}
                </div>
            );
        } else if (showTableAs === ShowTableAs.Table) {
            return (
                <div>
                    {props.cardProps && (
                        <Card
                            {...props.cardProps}
                            buttons={cardButtons}
                            title={getCardTitle(props.cardProps.title)}
                        >
                            {tableColumns.length === 0 &&
                            props.columns.length > 0 ? (
                                <ErrorMessage
                                    error={`You are not authorized to view this table. You need any one of these permissions: ${PermissionHelper.getPermissionTitles(
                                        model.getReadPermissions()
                                    ).join(', ')}`}
                                />
                            ) : (
                                <></>
                            )}
                            {!(
                                tableColumns.length === 0 &&
                                props.columns.length > 0
                            ) ? (
                                getTable()
                            ) : (
                                <></>
                            )}
                        </Card>
                    )}

                    {!props.cardProps && getTable()}
                </div>
            );
        }

        return (
            <div>
                {props.cardProps && (
                    <Card
                        {...props.cardProps}
                        buttons={cardButtons}
                        title={getCardTitle(props.cardProps.title)}
                    >
                        {getOrderedStatesList()}
                    </Card>
                )}

                {!props.cardProps && getOrderedStatesList()}
            </div>
        );
    };

    return (
        <>
            <div className="mb-5 mt-5">{getCardComponent()}</div>

            {showModel ? (
                props.callbacks.showCreateEditModal({
                    onClose: () => {
                        setShowModal(false);
                    },
                    modalType: modalType,
                    onBeforeCreate: async (
                        item: TBaseModel,
                        miscDataProps: JSONObject
                    ) => {
                        if (
                            showTableAs === ShowTableAs.OrderedStatesList &&
                            props.orderedStatesListProps?.orderField &&
                            orderedStatesListNewItemOrder
                        ) {
                            item.setColumnValue(
                                props.orderedStatesListProps.orderField,
                                orderedStatesListNewItemOrder
                            );
                        }

                        if (props.onBeforeCreate) {
                            item = await props.onBeforeCreate(
                                item,
                                miscDataProps
                            );
                        }

                        return item;
                    },
                    onSuccess: async (item: TBaseModel): Promise<void> => {
                        setShowModal(false);
                        setCurrentPageNumber(1);
                        await fetchItems();
                        if (props.onCreateSuccess) {
                            await props.onCreateSuccess(item);
                        }

                        return Promise.resolve();
                    },
                    modelIdToEdit: currentEditableItem
                        ? new ObjectID(currentEditableItem['_id'] as string)
                        : undefined,
                })
            ) : (
                <></>
            )}

            {showDeleteConfirmModal && (
                <ConfirmModal
                    title={`Delete ${props.singularName || model.singularName}`}
                    description={`Are you sure you want to delete this ${(
                        props.singularName ||
                        model.singularName ||
                        'item'
                    )?.toLowerCase()}?`}
                    onClose={() => {
                        setShowDeleteConfirmModal(false);
                    }}
                    submitButtonText={'Delete'}
                    onSubmit={async () => {
                        if (
                            currentDeleteableItem &&
                            currentDeleteableItem['_id']
                        ) {
                            await deleteItem(
                                props.callbacks.getModelFromJSON(
                                    currentDeleteableItem
                                )
                            );
                            setShowDeleteConfirmModal(false);
                        }
                    }}
                    submitButtonType={ButtonStyleType.DANGER}
                />
            )}

            {errorModalText && (
                <ConfirmModal
                    title={`Error`}
                    description={`${errorModalText}`}
                    submitButtonText={'Close'}
                    onSubmit={() => {
                        setErrorModalText('');
                    }}
                    submitButtonType={ButtonStyleType.NORMAL}
                />
            )}

            {showViewIdModal && (
                <ConfirmModal
                    title={`${
                        props.singularName || model.singularName || ''
                    } ID`}
                    description={
                        <div>
                            <span>
                                ID of this{' '}
                                {props.singularName || model.singularName || ''}
                                : {viewId}
                            </span>
                            <br />
                            <br />

                            <span>
                                You can use this ID to interact with{' '}
                                {props.singularName || model.singularName || ''}{' '}
                                via the OneUptime API. Click the button below to
                                go to API Reference.
                            </span>
                        </div>
                    }
                    onClose={() => {
                        setShowViewIdModal(false);
                    }}
                    submitButtonText={'Go to API Docs'}
                    onSubmit={() => {
                        setShowViewIdModal(false);
                        Navigation.navigate(
                            URL.fromString(API_DOCS_URL.toString()).addRoute(
                                '/' + model.getAPIDocumentationPath()
                            ),
                            { openInNewTab: true }
                        );
                    }}
                    submitButtonType={ButtonStyleType.NORMAL}
                    closeButtonType={ButtonStyleType.OUTLINE}
                />
            )}
        </>
    );
};

export default BaseModelTable;
