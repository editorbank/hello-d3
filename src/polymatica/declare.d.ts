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
/**
 * Функция-декоратор
 */
export declare function Declare(params?: {
    provideCssVariables: boolean;
}): ClassDecorator;
