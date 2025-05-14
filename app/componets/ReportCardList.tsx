import React, { Fragment } from 'react';
import ScrollViewComponent from './ScrollViewComponent';

interface Props {
    data: any
    Content: any
}

const ReportCardList = (props: Props) => {
    const {data, Content} = props
    return (
      <ScrollViewComponent gap={8}>
          {
            data?.map((d: any, index: number) => <Fragment key={index}><Content item={d}/></Fragment>)
          }
      </ScrollViewComponent>  
      );
}
export default ReportCardList