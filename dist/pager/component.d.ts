import { IPagerOptions, IPagerControllerApi } from './types';
declare function PagerBase<C extends IPagerControllerApi>(props: IPagerOptions<C>): JSX.Element;
export default PagerBase;
