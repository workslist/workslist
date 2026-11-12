import { el, svg, setChildren } from 'redom';
import '../css/spinner.scss';

export function spinner() {
  
  const boxSpinner = el('div', { id: 'load', class: 'load' });

  const spinner = svg(
    'svg',
    { class: 'spinner', viewBox: '0 0 50 50' },
    svg('circle', {
      class: 'path',
      cx: 25,
      cy: 25,
      r: 20,
      fill: 'none',
      'stroke-width': 5,
    })
  );

  boxSpinner.append(spinner);

  return boxSpinner;
}