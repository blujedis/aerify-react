import React from 'react';
import { IPagerOptions, IPagerControllerApi } from './types';

function PagerBase <C extends IPagerControllerApi>(props: IPagerOptions<C>)  {

  const { controller, ...rest } = props;

  return (
    <div { ...rest}>
      My Pager
    </div>
  );

}

export default PagerBase;