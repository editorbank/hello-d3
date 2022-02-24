"use strict";
/**
 * Для получения текущей темы, виджет должен имплементировать
 * интерфейс OnThemeChange:
 *
 * ```ts
 * import { Declare, Widget, OnThemeChange } from 'ptnl-constructor-sdk';
 * import { Theme } from 'ptnl-constructor-sdk/theme';
 *
 * @Declare()
 * class MyWidget extends Widget implements OnThemeChange {
 *     onThemeChange(theme: Theme): void {}
 * }
 * ```
 *
 * @packageDocumentation
 * @module Работа с темами
 */
Object.defineProperty(exports, "__esModule", { value: true });
