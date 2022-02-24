"use strict";
/**
 * Для того, чтобы виджет получал и управлял данными,
 * класс виджета необходимо декорировать функцией Declare:
 *
 * ```ts
 * import { Declare, Widget } from 'ptnl-constructor-sdk';
 *
 * @Declare()
 * class MyWidget extends Widget {}
 * ```
 *
 * @packageDocumentation
 * @module Регистрация виджета
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declare = void 0;
const logical_not_1 = require("logical-not");
const data_1 = require("./data");
const widget_io_1 = require("./__internal__/widget-io");
const widget_provide_data_1 = require("./__internal__/widget-provide-data");
const theme_1 = require("./__internal__/theme");
const widget_1 = require("./__internal__/widget");
/**
 * Функция-декоратор
 */
function Declare(params) {
    if (logical_not_1.not(params))
        params = {
            provideCssVariables: false,
        };
    return (T) => {
        const instance = new T();
        const token = readFromUrl('token');
        Object.assign(instance, {
            viewSettings: {},
            ready() {
                output(token, widget_io_1.Output.Ready);
            },
        });
        const dataSettingsMethods = {
            setFilter(filter, target = data_1.Target.Self) {
                output(token, widget_io_1.Output.SetFilter, {
                    filter,
                    target,
                });
            },
            removeFilterAt(index) {
                output(token, widget_io_1.Output.RemoveFilterAt, {
                    index,
                });
            },
            setSort(sort, target = data_1.Target.Self) {
                output(token, widget_io_1.Output.SetSort, { sort, target });
            },
            removeSortAt(index) {
                output(token, widget_io_1.Output.RemoveSortAt, {
                    index,
                });
            },
            interact(dataIndex) {
                output(token, widget_io_1.Output.Interact, {
                    dataOptionId: this.id,
                    dataIndex,
                });
            },
        };
        let inited = false;
        input(widget_io_1.Input.Change, (widgetRepresent) => {
            widget_provide_data_1.provideDataTo(instance, widgetRepresent, dataSettingsMethods);
            if (logical_not_1.not(inited)) {
                inited = true;
                if (typeof instance.onInit === 'function') {
                    instance.onInit();
                }
            }
            if (typeof instance.onChange === 'function') {
                instance.onChange();
            }
        });
        input(widget_io_1.Input.ChangeLang, (lang) => {
            instance.lang = lang;
            if (instance.onLangChange && inited)
                instance.onLangChange();
        });
        input(widget_io_1.Input.ChangeTheme, (value) => {
            instance.theme = value.theme;
            if (params.provideCssVariables)
                theme_1.provideCssVariables(value);
            if (instance.onThemeChange && inited)
                instance.onThemeChange();
        });
        input(widget_io_1.Input.ChangeOtherFilters, (source) => widget_1.dispatchChangeOtherFilters(instance, source));
        output(token, widget_io_1.Output.Init);
        return T;
    };
}
exports.Declare = Declare;
function input(type, callback) {
    window.addEventListener('message', ({ data }) => {
        if (data.type === type)
            callback(data.payload);
    });
}
function output(token, type, payload) {
    const message = { type, token, payload };
    window.parent.postMessage(message, '*');
}
function readFromUrl(key) {
    const startsWith = key + '=';
    const source = window.location.search
        .split(/[?&]/)
        .find((item) => item.startsWith(startsWith));
    return source ? source.slice(startsWith.length) : '';
}
