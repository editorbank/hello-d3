"use strict";
/**
 * Для выборки данных, а также управлением фильтрами и сортировкой...
 *
 * @packageDocumentation
 * @module Работа с данными
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = exports.SortDirection = exports.FilterMethod = exports.ColumnType = void 0;
// enums
var ColumnType;
(function (ColumnType) {
    ColumnType["String"] = "string";
    ColumnType["Number"] = "number";
    ColumnType["Boolean"] = "boolean";
    ColumnType["Date"] = "date";
    ColumnType["Array"] = "array";
    ColumnType["Object"] = "object";
})(ColumnType = exports.ColumnType || (exports.ColumnType = {}));
var FilterMethod;
(function (FilterMethod) {
    FilterMethod["Equal"] = "equally";
    FilterMethod["NotEqual"] = "not_equal";
    FilterMethod["GreaterThen"] = "gt";
    FilterMethod["LessThen"] = "lt";
    FilterMethod["GreaterThenOrEqual"] = "gte";
    FilterMethod["LessThenOrEqual"] = "lte";
    FilterMethod["Period"] = "period";
    FilterMethod["DateList"] = "date_list";
    FilterMethod["InList"] = "in_list";
    FilterMethod["NotInList"] = "nin_list";
    FilterMethod["StartsOnIndex"] = "starts_on_i";
    FilterMethod["StartsOn"] = "starts_on";
    FilterMethod["EndsOnIndex"] = "ends_on_i";
    FilterMethod["EndsOn"] = "ends_on";
    FilterMethod["ContainsIndex"] = "contains_i";
    FilterMethod["Contains"] = "contains";
    FilterMethod["NotContainIndex"] = "not_contain_i";
    FilterMethod["NotContain"] = "not_contain";
})(FilterMethod = exports.FilterMethod || (exports.FilterMethod = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "ASC";
    SortDirection["Desc"] = "DESC";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var Target;
(function (Target) {
    Target["Self"] = "self";
    Target["Other"] = "other";
    Target["All"] = "all";
})(Target = exports.Target || (exports.Target = {}));
