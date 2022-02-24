/**
 * xXxXx
 *
 * @packageDocumentation
 * @module Класс Widget
 */
import { Column, Filter, Target, Sort, DataItem } from './data';
import { Locale } from './config';
import { Theme } from './theme';
export declare abstract class Widget {
    viewSettings: ViewSettings;
    theme: Theme;
    lang: Locale;
    ready(): void;
    onInit(): void;
    abstract onChange(): void;
    onThemeChange(): void;
    onLangChange(): void;
}
export interface SingleData {
    readonly data: DataItem[];
    readonly dataSettings: DataSettings;
}
export interface MultiData {
    readonly data: {
        [key: string]: DataItem[];
    };
    readonly dataSettings: DataSettingsMap;
}
export interface DataSettingsMap {
    [key: string]: DataSettings;
}
export interface DataSettings {
    columns: Column[];
    columnsByBlock: Record<string, Column[]>;
    filters: Filter[];
    sort: Sort[];
    colorize: ColorizeItem[];
    total: number;
    limit: number;
    offset: number;
    setFilter(filter: Filter, target?: Target): void;
    removeFilterAt(index: number): void;
    setSort(sort: Sort | null): void;
    removeSortAt(index: number): void;
    interact(dataIndex: number): void;
    events: {
        onOtherFilterChange?: (filter: Filter) => void;
    };
}
export interface ColorizeItem {
    column: Column;
    getColor(value: number): string;
}
export interface ViewSettings {
    [key: string]: any;
}
