/**
 * Для выборки данных, а также управлением фильтрами и сортировкой...
 *
 * @packageDocumentation
 * @module Работа с данными
 */
export declare enum ColumnType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Date = "date",
    Array = "array",
    Object = "object"
}
export declare enum FilterMethod {
    Equal = "equally",
    NotEqual = "not_equal",
    GreaterThen = "gt",
    LessThen = "lt",
    GreaterThenOrEqual = "gte",
    LessThenOrEqual = "lte",
    Period = "period",
    DateList = "date_list",
    InList = "in_list",
    NotInList = "nin_list",
    StartsOnIndex = "starts_on_i",
    StartsOn = "starts_on",
    EndsOnIndex = "ends_on_i",
    EndsOn = "ends_on",
    ContainsIndex = "contains_i",
    Contains = "contains",
    NotContainIndex = "not_contain_i",
    NotContain = "not_contain"
}
export declare enum SortDirection {
    Asc = "ASC",
    Desc = "DESC"
}
export declare enum Target {
    Self = "self",
    Other = "other",
    All = "all"
}
export interface DataItem {
    [path: string]: any;
}
export interface Column {
    type: ColumnType;
    id: number;
    path: string;
    name: string;
}
export interface Filter {
    column: Column;
    method: FilterMethod;
    value: string | number | string[] | number[];
}
export interface Sort {
    column: Column;
    direction: SortDirection;
}
