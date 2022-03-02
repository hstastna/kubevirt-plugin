import * as React from 'react';

import { RowProps, TableData } from '@openshift-console/dynamic-plugin-sdk';

import { NO_DATA_DASH } from '../../../utils/constants';

import { getPrintableNetworkInterfaceType, NetworkPresentation } from './utils/utils';
import NetworkInterfaceActions from './NetworkInterfaceActions';

export type NetworkInterfaceRowProps = {
  obj: NetworkPresentation;
};

const NetworkInterfaceRow: React.FC<RowProps<NetworkPresentation>> = ({
  obj: { iface, network },
  activeColumnIDs,
}) => {
  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs}>
        {network.name}
      </TableData>
      <TableData id="model" activeColumnIDs={activeColumnIDs}>
        {iface.model || NO_DATA_DASH}
      </TableData>
      <TableData id="network" activeColumnIDs={activeColumnIDs}>
        {network.pod ? 'Pod networking' : network.multus?.networkName || NO_DATA_DASH}
      </TableData>
      <TableData id="type" activeColumnIDs={activeColumnIDs}>
        {getPrintableNetworkInterfaceType(iface)}
      </TableData>
      <TableData id="macAddress" activeColumnIDs={activeColumnIDs}>
        {iface.macAddress || NO_DATA_DASH}
      </TableData>
      <TableData
        id="actions"
        activeColumnIDs={activeColumnIDs}
        className="dropdown-kebab-pf pf-c-table__action"
      >
        <NetworkInterfaceActions />
      </TableData>
    </>
  );
};

export default NetworkInterfaceRow;
