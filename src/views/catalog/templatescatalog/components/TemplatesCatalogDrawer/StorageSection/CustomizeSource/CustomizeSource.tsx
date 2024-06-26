import React, { FC, useCallback } from 'react';

import { V1Template } from '@kubevirt-ui/kubevirt-api/console';
import { V1beta1DataVolumeSpec, V1ContainerDiskSource } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { ROOTDISK } from '@kubevirt-utils/constants/constants';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { getTemplateImportURLs } from '@kubevirt-utils/resources/template';
import { isEmpty } from '@kubevirt-utils/utils/utils';
import { Divider } from '@patternfly/react-core';

import { useDrawerContext } from '../../hooks/useDrawerContext';
import BootCDCheckbox from '../BootCDCheckboxLabel';
import { addInstallationCDRom, removeCDInstallation } from '../cd';
import {
  BLANK_SOURCE_NAME,
  CD_SOURCES,
  DISK_SOURCES_WITH_DEFAULT,
  INSTALLATION_CDROM_NAME,
} from '../constants';
import DriversCheckbox from '../DriversCheckbox';
import {
  getDiskSource,
  getRegistryHelperText,
  overrideVirtualMachineDataVolumeSpec,
} from '../utils';

import StorageClassSelect from './StorageClassSelect/StorageClassSelect';
import SelectCDSourcePopOver from './SelectCDSourcePopOver';
import SelectDiskSourcePopOver from './SelectDiskSourcePopOver';
import { SelectSource } from './SelectSource';
import { getGenericSourceCustomization, getQuantityFromSource } from './utils';

import './CustomizeSource.scss';

export type CustomizeSourceProps = {
  template: V1Template;
};

export const CustomizeSource: FC<CustomizeSourceProps> = ({ template }) => {
  const { t } = useKubevirtTranslation();
  const {
    cdUpload,
    diskUpload,
    setCDFile,
    setDiskFile,
    setStorageClassName,
    setVM,
    storageClassName,
    storageClassRequired,
    vm,
  } = useDrawerContext();

  const diskSource = getDiskSource(vm, ROOTDISK);

  const cdSource = getDiskSource(vm, INSTALLATION_CDROM_NAME);

  const httpSourceHelperURL = getTemplateImportURLs(template)?.[0];
  const registrySourceHelperText = getRegistryHelperText(template);

  const onCDCheckboxChange = useCallback(
    (checked) => {
      const newVM = checked ? addInstallationCDRom(vm, { image: '' }) : removeCDInstallation(vm);

      const blankSource = getGenericSourceCustomization(
        BLANK_SOURCE_NAME,
        null,
        getQuantityFromSource(diskSource as V1beta1DataVolumeSpec),
      );

      const vmToUpdate = overrideVirtualMachineDataVolumeSpec(newVM, blankSource);
      setVM(vmToUpdate);
    },
    [vm, diskSource, setVM],
  );

  const onCDSourceChange = useCallback(
    (customSource: V1beta1DataVolumeSpec | V1ContainerDiskSource) => {
      setVM(addInstallationCDRom(vm, customSource));
    },
    [vm, setVM],
  );

  const onDiskSourceChange = useCallback(
    (customSource: V1beta1DataVolumeSpec) => {
      const newVM = overrideVirtualMachineDataVolumeSpec(vm, customSource);

      setVM(newVM);
    },
    [vm, setVM],
  );

  const onStorageClassChange = (value: string) => {
    setStorageClassName(value);

    const source: V1beta1DataVolumeSpec = { ...(diskSource as V1beta1DataVolumeSpec) };
    const updatedSource: V1beta1DataVolumeSpec = {
      ...source,
      storage: { ...source.storage, storageClassName: value },
    };
    onDiskSourceChange(updatedSource);
  };

  return (
    <div className="storage-section__customize-source">
      <BootCDCheckbox hasCDSource={!isEmpty(cdSource)} onChange={onCDCheckboxChange} />

      {cdSource && (
        <>
          <SelectSource
            data-test-id="cd-boot-source"
            httpSourceHelperURL={httpSourceHelperURL}
            onFileSelected={setCDFile}
            onSourceChange={onCDSourceChange}
            registrySourceHelperText={registrySourceHelperText}
            relevantUpload={cdUpload}
            selectedSource={cdSource}
            sourceLabel={t('CD source')}
            sourceOptions={CD_SOURCES}
            sourcePopOver={<SelectCDSourcePopOver />}
          />
          <Divider className="divider" />
        </>
      )}

      <SelectSource
        data-test-id="disk-boot-source"
        httpSourceHelperURL={httpSourceHelperURL}
        onFileSelected={setDiskFile}
        onSourceChange={onDiskSourceChange}
        registrySourceHelperText={registrySourceHelperText}
        relevantUpload={diskUpload}
        selectedSource={diskSource}
        sourceLabel={t('Disk source')}
        sourceOptions={DISK_SOURCES_WITH_DEFAULT}
        sourcePopOver={<SelectDiskSourcePopOver />}
        withSize={diskSource && !('image' in diskSource)}
      />
      <StorageClassSelect
        onStorageClassChange={onStorageClassChange}
        storageClassName={storageClassName}
        storageClassRequired={storageClassRequired}
      />
      <Divider className="divider" />
      <DriversCheckbox />
    </div>
  );
};
