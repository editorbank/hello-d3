# Constructor SDK

-   [Конфигурация виджета](#config)
    -   [Настройка получения виджетом данных dataSettings](#data-settings)
    -   [Метод группировки данных DataQueryMethod](#data-query-method)
-   [Код виджета](#widget)
    -   [SingleData и MultiData](#single-multy-data))
    -   [Life cycle](#life-cycle)
    -   [CSS переменные](#css-var)
-   [Настройки виджета (установка параметров при создании)](#view-settings)

<a name="config"></a>

## Конфигурация виджета

Конфигурацию описывает интерфейс `Config`. Рассмотрим пример:

```ts
import {
    block,
    colorize,
    Config,
    DataQueryFunction,
    DataQueryMethod,
    filter,
    sort,
} from 'ptnl-constructor-sdk/config';

export const config: Config = {
    // Имя виджета. Отображается в списке загруженых выджетов
    label: {
        ru: 'Имя на русском',
        en: 'И на английском',
    },
    // Иконка виджета. Отображается в списке загруженых выджетов
    icon: 'icon.svg',

    // см. Настройка получения виджетом данных
    dataSettings: {
        // см. Метод группировки данных
        method: DataQueryMethod.Aggregate,

        //
        blocks: [
            block({
                // По данному ключу можно получить колонки в виджете
                // this.dataSettings.columnsByBlock['uniq-key']
                key: 'uniq-key',
                label: { ru: 'Columns', en: '' },
                // Влияет на агрегацию данных
                // см. Метод группировки данных
                dataQueryFunction: DataQueryFunction.Sum,
            }),

            // Добавляет блок для колонок, по которым будет осуществляться фильтрация
            // Доступны в виджете через this.dataSettings.filters
            filter(),

            // Добавляет блок для колонок, по которым будет осуществляться сортировка
            // Доступны в виджете через this.dataSettings.sort
            sort(),

            // Добавляет блок для колонок, по которым будет осуществляться раскраска
            // Настройки раскраски доступна через
            // this.dataSettings.colorize
            colorize(),
        ],
    },
};
```

<a name="data-settings"></a>

### Настройка получения виджетом данных dataSettings

Параметр конфигурации `dataSettings` описывает, из каких колонок датасета требуются данные, способ их фильтрации,
сортировку, а также способ агрегации данных. Чаще всего виджет использует один датасет, но если требуется несколько
датасетов, в конфигурации необходимо указать описание каждого в массиве, указав для каждого уникальный ключ:

```ts
    // ...
    dataSettings: [
        {
            key: 'dataset-1',
            label: { ru: 'Первый источник', en: '' },

            method: DataQueryMethod.Table,
            blocks: [
                // ...
            ],
        },
        {
            key: 'dataset-2',
            label: { ru: 'Второй источник', en: '' },

            method: DataQueryMethod.Aggregate,
            blocks: [
                // ...
            ],
        },
    ],
    // ...
```

По значению ключей в виджете будут доступны данные и настройки (см. [SingleData и MultiData](#single-multy-data))

<a name="data-query-method"></a>

### Метод группировки данных DataQueryMethod

Этот параметр может менять данные из датасета. Для примера рассмотрим исходную таблицу

```
╔═══╤═══╤═══╗
║ A │ C │ 1 ║
╟───┼───┼───╢
║ A │ C │ 2 ║
╟───┼───┼───╢
║ B │ C │ 7 ║
╚═══╧═══╧═══╝
```

Для `DataQueryMethod.Table` данные вернуться в исходном виде, тогда как для параметра
`DataQueryMethod.Aggregate` будет произведена агрегация в зависимоти от параметра `dataQueryFunction`
у блока. Например, при `DataQueryFunction.Sum` происходит суммирование числовых столбцов и
группировка по значением в столбцах других типов. При этом данные в виджет попадут в таком виде:

```
╔═══╤═══╤═══╗
║ A │ C │ 3 ║
╟───┼───┼───╢
║ B │ C │ 7 ║
╚═══╧═══╧═══╝
```

<a name="widget"></a>

## Код виджета

Рассмотрим виджет

```ts
import { Declare, SingleData, Widget } from 'ptnl-constructor-sdk';

@Declare()
export class Example extends Widget implements SingleData {
    readonly data!: SingleData['data'];
    readonly dataSettings!: SingleData['dataSettings'];

    onChange(): void {
        // ...

        // ВАЖНО! Метод ready необходимо вызывать после каждого вызова onChange
        this.ready();
    }
}
```

Чтобы класс стал виджетом, его необходимо декорировать `@Declare()`. Также, благодаря наследованию
от базового класса `Widget`, будут доступны для автокомплика методы (например, `onThemeChange`) и свойства (например, `lang`).

<a name="single-multy-data"></a>

### SingleData и MultiData

При конфигурировании можно указать [как один, так и несколько](#data-settings) источников данных.
В зависимости от этого виджет будет реализовывать один из этих интерфейсов. Например, для нескольких датасетов, данные
для каждого из них будут доступны через `key`, указанный в конфигурации:

```ts
import { Declare, MultiData, Widget } from 'ptnl-constructor-sdk';

@Declare()
export class WidgetFilters extends Widget implements MultiData {
    readonly data!: MultiData['data'];
    readonly dataSettings!: MultiData['dataSettings'];

    onChange(): void {
        this.dataSettings['dataset-key'].dataset.name;
    }
```

<a name="life-cycle"></a>

### Life cycle

Порядок срабатывания хуков виджета:

-   `onThemeChange` при инициализации и при смене темы
-   `onLangChange` при инициализации и при смене языка
-   `onInit` при инициализации
-   `onChange` при инициализации и при смене данных

<a name="css-var"></a>

### CSS переменные

По умолчанию, css переменные не объявляются. Для их инициализации необходимо указать параметр
`provideCssVariables` у декоратора `Declare`:

```ts
@Declare({
    provideCssVariables: true,
})
```

При этом будут объявлены все переменные, доступные для виджета через `this.theme`, но в kebab-case:

```css
/* this.theme.text → --text */
color: var(--text);
/* this.theme.backgroundBright → --background-bright */
background: var(--background-bright);
```

<a name="view-settings"></a>

## Настройки виджета (установка параметров при создании)

При создании виджета, пользователь может установить параметры следующих типов:

-   input
-   checkbox
-   radio
-   select
-   colorPicker
-   title (заголовок блока настроек, используется для разделения параметров на блоки)

Эти параметры получаются динамически из вызова функции `createViewSettings` в файле `src/view-settings.ts`.
Рассмотрим пример. Здесь выводится текстовое поле, в которое можно ввести число от 1 до количества колонок
в блоке с ключом `blocke-key`:

```ts
import { DataSettings } from 'ptnl-constructor-sdk';
import {
    CreateViewSettings,
    input,
    ViewSettingsValidation,
} from 'ptnl-constructor-sdk/config';

let max = 0;

export const createViewSettings: CreateViewSettings<DataSettings> = ({
    dataSettings,
}) => {
    max = dataSettings.columnsByBlock['blocke-key'].length;

    return [
        input({
            key: 'number-key',
            label: {
                ru: `Число от 1 до ${max}`,
                en: `Range 1 to ${max}`,
            },
        }),
    ];
};

export const validation: ViewSettingsValidation = {
    ['number-key']: (value: any) => {
        const number = parseInt(value);

        if (isNaN(number))
            return {
                ru: 'Значение должно быть числом',
                en: 'Not a number',
            };

        if (number < 1 || number > max)
            return {
                ru: `Значение должно быть в диапозоне от 1 до ${max}`,
                en: `Not in range 1 до ${max}`,
            };

        return null;
    },
};
```
