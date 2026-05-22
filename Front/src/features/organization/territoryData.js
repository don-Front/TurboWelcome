export const TERRITORY_INTRO = [
  'На территории базы «Спектр» расположены 4 здания нашей группы компаний.',
  'На первом проезде — здания 3/7 и 4/11.',
  'На втором проезде — здание 6/8.',
  'На третьем проезде — здание 8/8.',
];

export const TERRITORY_TABLE_COLUMNS = ['3/7', '4/11', '6/8', '8/8'];

export const TERRITORY_TABLE_ROWS = [
  ['ТД «Амурская легенда»', 'Производство БМИ', 'Служба персонала', 'ОМТО'],
  ['ООО «Метрогазсервис»', 'Кабинет охраны труда', 'Служба развития', 'Производство №1'],
  ['Метрологическая служба', '', 'Коммерческая служба', 'Отдел технического контроля'],
  ['', '', 'Юр.лицо «Алмаз» - производство и администрация', 'Склад ООО НПО «Турбулентность-ДОН»'],
  ['', '', 'Сервисная служба', ''],
  ['', '', 'Группа сопровождения продаж и производства (ГСПП)', ''],
  ['', '', 'Конструкторское бюро', ''],
  ['', '', 'Управление делами', ''],
  ['', '', 'Приемная Председателя совета директоров', ''],
  ['', '', 'Директор ООО НПО «Турбулентность-ДОН»', ''],
  ['', '', 'Директор по производству - заместитель операционного директора', ''],
  ['', '', 'Бухгалтерия', ''],
];

export const TERRITORY_VIEW_MODES = [
  {
    id: 'popup',
    label: 'Попап',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M15 15l3 3M18 15v3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'card',
    label: 'Карточка',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M18 8l2 2-2 2M6 16l-2-2 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'split',
    label: 'Панель',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="11" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="16" y="7" width="5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];
