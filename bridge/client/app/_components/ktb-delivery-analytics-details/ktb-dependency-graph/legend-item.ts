export interface LegendItem {
    label: string;
    type: 'active' | 'inactive' | 'warning' | 'error';
    style: 'solid' | 'dashed' | 'arrow';
}
