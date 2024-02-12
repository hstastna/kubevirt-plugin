import React, { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';

import { Button, ButtonVariant, StackItem } from '@patternfly/react-core';

import { WelcomeModalButtonsData } from '../utils/types';
import { welcomeModalButtons } from '../utils/utils';

type WelcomeButtonsProps = {
  onClose: () => Promise<void> | void;
};

const WelcomeButtons: FC<WelcomeButtonsProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { ns } = useParams<{ ns: string }>();

  return (
    <>
      {welcomeModalButtons(ns).map((modalButton: WelcomeModalButtonsData) => (
        <StackItem key={modalButton.name}>
          <Button
            onClick={() => {
              navigate(modalButton.url);
              onClose();
            }}
            className={modalButton?.className || 'WelcomeModal__button-link'}
            variant={modalButton?.variant || ButtonVariant.link}
          >
            {modalButton.name}
          </Button>
        </StackItem>
      ))}
    </>
  );
};

export default WelcomeButtons;
