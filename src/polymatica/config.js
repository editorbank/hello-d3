"use strict";
/**
 * К помощью конфигурация настраивается получение данных
 *
 * @packageDocumentation
 * @module Конфигурация
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.title = exports.colorPicker = exports.select = exports.radio = exports.checkbox = exports.textArea = exports.input = exports.ViewSettingsItem = exports.drilldown = exports.colorize = exports.sort = exports.filter = exports.block = exports.Block = exports.BlockIcon = exports.DataQueryFunction = exports.DataQueryMethod = void 0;
const data_1 = require("./data");
const config_1 = require("./__internal__/config");
const dataset_1 = require("./__internal__/dataset");
const view_settings_1 = require("./__internal__/view-settings");
// enums
var DataQueryMethod;
(function (DataQueryMethod) {
    DataQueryMethod["Table"] = "table";
    DataQueryMethod["Aggregate"] = "aggregate";
})(DataQueryMethod = exports.DataQueryMethod || (exports.DataQueryMethod = {}));
var DataQueryFunction;
(function (DataQueryFunction) {
    DataQueryFunction["Group"] = "group";
    DataQueryFunction["Sum"] = "sum";
    DataQueryFunction["Average"] = "avg";
    DataQueryFunction["Min"] = "min";
    DataQueryFunction["Max"] = "max";
    DataQueryFunction["First"] = "first";
    DataQueryFunction["Last"] = "last";
})(DataQueryFunction = exports.DataQueryFunction || (exports.DataQueryFunction = {}));
var BlockIcon;
(function (BlockIcon) {
    BlockIcon["AxisX"] = "sys:axis-x";
    BlockIcon["AxisY"] = "sys:axis-y";
    BlockIcon["Value"] = "sys:value-column";
})(BlockIcon = exports.BlockIcon || (exports.BlockIcon = {}));
// blocks
const token = Symbol();
class Block {
    constructor(_) {
        if (_ !== token)
            throw new Error('Illigal constructor');
    }
}
exports.Block = Block;
function createBlock(source) {
    return Object.assign(new Block(token), {
        [config_1.configDataBlock_Server]: {
            type: source.type,
            key: source.key,
            label: source.label,
            icon: source.icon || '',
            data_type: source.data_type,
            max: source.max || 0,
            function: source.function || null,
        },
    });
}
function block(params) {
    const columnTypes = params.columnTypes || [];
    const hasNumberType = columnTypes.includes(data_1.ColumnType.Number);
    let columnType;
    switch (columnTypes.length) {
        case 0:
            columnType = dataset_1.DatasetColumnType_Server.Any;
            break;
        case 1:
            columnType = hasNumberType
                ? dataset_1.DatasetColumnType_Server.Fact
                : dataset_1.DatasetColumnType_Server.Dimension;
            break;
        default:
            columnType = hasNumberType
                ? dataset_1.DatasetColumnType_Server.Any
                : dataset_1.DatasetColumnType_Server.Dimension;
    }
    return createBlock({
        type: config_1.ConfigDataBlockType_Server.Column,
        key: params.key,
        label: params.label,
        icon: params.icon,
        max: params.max,
        function: params.dataQueryFunction,
        data_type: columnType,
    });
}
exports.block = block;
function filter(params = {}) {
    return createBlock({
        type: config_1.ConfigDataBlockType_Server.Filter,
        key: config_1.blockFilterKey,
        label: params.label || {
            ru: 'Фильтры',
            en: 'Filters',
        },
        icon: params.icon || BlockIcon.Value,
    });
}
exports.filter = filter;
function sort(params = {}) {
    return createBlock({
        type: config_1.ConfigDataBlockType_Server.Sort,
        key: config_1.blockSortKey,
        label: params.label || {
            ru: 'Сортировка',
            en: 'Sort',
        },
        icon: params.icon || BlockIcon.Value,
    });
}
exports.sort = sort;
function colorize(params = {}) {
    return createBlock({
        type: config_1.ConfigDataBlockType_Server.Colorizer,
        key: config_1.blockColorizeKey,
        label: params.label || {
            ru: 'Цветовая дифференциация',
            en: 'Colors',
        },
        icon: params.icon || BlockIcon.Value,
        max: params.max || 0,
    });
}
exports.colorize = colorize;
function drilldown(params) {
    return createBlock({
        type: config_1.ConfigDataBlockType_Server.Drilldown,
        key: config_1.decodeDrilldownData(params.source, params.additionalFilterSources || []),
        label: params.label || {
            ru: 'Drilldown',
            en: 'Drilldown',
        },
        icon: BlockIcon.Value,
        max: 4,
    });
}
exports.drilldown = drilldown;
class ViewSettingsItem {
    constructor(_) {
        if (_ !== token)
            throw new Error('Illigal constructor');
    }
}
exports.ViewSettingsItem = ViewSettingsItem;
function createViewSettingsItem(value) {
    return Object.assign(new ViewSettingsItem(token), {
        [view_settings_1.viewSettingsItemValue]: value,
    });
}
function input(params) {
    return createViewSettingsItem(Object.assign({ type: view_settings_1.ViewSettingsItemType.Input }, params));
}
exports.input = input;
function textArea(params) {
    return createViewSettingsItem(Object.assign({ type: view_settings_1.ViewSettingsItemType.TextArea }, params));
}
exports.textArea = textArea;
function checkbox(params) {
    return createViewSettingsItem(Object.assign({ type: view_settings_1.ViewSettingsItemType.Checkbox }, params));
}
exports.checkbox = checkbox;
function radio(params) {
    return createViewSettingsItem(Object.assign({ type: view_settings_1.ViewSettingsItemType.Radio }, params));
}
exports.radio = radio;
function select(params) {
    return createViewSettingsItem(Object.assign({ type: view_settings_1.ViewSettingsItemType.Select }, params));
}
exports.select = select;
function colorPicker(params) {
    return createViewSettingsItem(Object.assign({ type: view_settings_1.ViewSettingsItemType.ColorPicker }, params));
}
exports.colorPicker = colorPicker;
function title(label) {
    return createViewSettingsItem({
        type: view_settings_1.ViewSettingsItemType.Input,
        key: '',
        label,
    });
}
exports.title = title;
