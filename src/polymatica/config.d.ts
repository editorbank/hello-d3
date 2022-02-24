/**
 * К помощью конфигурация настраивается получение данных
 *
 * @packageDocumentation
 * @module Конфигурация
 */
import { ColumnType } from './data';
import { DataSettings as WidgetDataSettings, DataSettingsMap as WidgetDataSettingsMap, ViewSettings } from './widget';
import { configDataBlock_Server } from './__internal__/config';
import { viewSettingsItemValue } from './__internal__/view-settings';
export declare enum DataQueryMethod {
    Table = "table",
    Aggregate = "aggregate"
}
export declare enum DataQueryFunction {
    Group = "group",
    Sum = "sum",
    Average = "avg",
    Min = "min",
    Max = "max",
    First = "first",
    Last = "last"
}
export declare enum BlockIcon {
    AxisX = "sys:axis-x",
    AxisY = "sys:axis-y",
    Value = "sys:value-column"
}
export declare type Locale = 'ru' | 'en';
export declare type Text = Record<Locale, string>;
export interface Config {
    label: Text;
    icon: string;
    dataSettings: Omit<DataSettings, 'key'> | DataSettings[];
}
export interface DataSettings {
    method: DataQueryMethod;
    key: string;
    label?: Text;
    min?: number;
    max?: number;
    validation?: {
        requiredSome?: string[];
        requiredEvery?: string[];
    };
    blocks: Block[];
}
export declare class Block {
    private [configDataBlock_Server];
    constructor(_: symbol);
}
export declare function block(params: {
    key: string;
    dataQueryFunction: DataQueryFunction;
    label: Text;
    columnTypes?: ColumnType[];
    icon?: BlockIcon | string;
    max?: number;
}): Block;
export declare function filter(params?: {
    label?: Text;
    icon?: BlockIcon | string;
}): Block;
export declare function sort(params?: {
    label?: Text;
    icon?: BlockIcon | string;
}): Block;
export declare function colorize(params?: {
    label?: Text;
    icon?: BlockIcon | string;
    max?: number;
}): Block;
export declare function drilldown(params: {
    source: string;
    additionalFilterSources?: string[];
    label?: Text;
}): Block;
export interface CreateViewSettings<DataSettings extends WidgetDataSettings | WidgetDataSettingsMap> {
    (settings: {
        dataSettings: DataSettings;
        viewSettings: ViewSettings;
    }): ViewSettingsItem[];
}
export declare type ViewSettingsValidator = (value: any) => Text | null;
export interface ViewSettingsValidation {
    [key: string]: ViewSettingsValidator;
}
export declare class ViewSettingsItem {
    private [viewSettingsItemValue];
    constructor(_: symbol);
}
export declare function input(params: {
    key: string;
    label: Text;
    span?: number;
    defaultValue?: string;
}): ViewSettingsItem;
export declare function textArea(params: {
    key: string;
    label: Text;
    span?: number;
    defaultValue?: string;
}): ViewSettingsItem;
export declare function checkbox(params: {
    key: string;
    label: Text;
    span?: number;
    defaultValue?: boolean;
}): ViewSettingsItem;
export declare function radio(params: {
    key: string;
    label: Text;
    options: {
        label: Text;
        value: string;
    }[];
    span?: number;
    defaultValue?: string;
}): ViewSettingsItem;
export declare function select(params: {
    key: string;
    label: Text;
    options: {
        label: Text;
        value: string;
    }[];
    span?: number;
    defaultValue?: string;
}): ViewSettingsItem;
export declare function colorPicker(params: {
    key: string;
    label: Text;
    span?: number;
    defaultValue?: string;
}): ViewSettingsItem;
export declare function title(label: any): ViewSettingsItem;
