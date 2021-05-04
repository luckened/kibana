/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { isEmpty } from 'lodash/fp';
import {
  ACTION_TYPES_URL,
  ActionConnector,
  ActionTypeConnector,
  CASE_CONFIGURE_CONNECTORS_URL,
  CASE_CONFIGURE_URL,
  CasesConfigurePatch,
  CasesConfigureRequest,
  CasesConfigureResponse,
  CasesConfigurationsResponse,
  getCaseConfigurationDetailsUrl,
} from '../../../common';
import { KibanaServices } from '../../common/lib/kibana';

import { ApiProps } from '../types';
import {
  convertToCamelCase,
  decodeCaseConfigurationsResponse,
  decodeCaseConfigureResponse,
} from '../utils';
import { CaseConfigure } from './types';

export const fetchConnectors = async ({ signal }: ApiProps): Promise<ActionConnector[]> => {
  const response = await KibanaServices.get().http.fetch(`${CASE_CONFIGURE_CONNECTORS_URL}/_find`, {
    method: 'GET',
    signal,
  });

  return response;
};

// TODO: refactor
export const getCaseConfigure = async ({ signal }: ApiProps): Promise<CaseConfigure | null> => {
  const response = await KibanaServices.get().http.fetch<CasesConfigurationsResponse>(
    CASE_CONFIGURE_URL,
    {
      method: 'GET',
      signal,
    }
  );

  if (!isEmpty(response)) {
    const decodedConfigs = decodeCaseConfigurationsResponse(response);
    if (Array.isArray(decodedConfigs) && decodedConfigs.length > 0) {
      return convertToCamelCase<CasesConfigureResponse, CaseConfigure>(decodedConfigs[0]);
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const getConnectorMappings = async ({ signal }: ApiProps): Promise<ActionConnector[]> => {
  const response = await KibanaServices.get().http.fetch(`${CASE_CONFIGURE_CONNECTORS_URL}/_find`, {
    method: 'GET',
    signal,
  });

  return response;
};

export const postCaseConfigure = async (
  caseConfiguration: CasesConfigureRequest,
  signal: AbortSignal
): Promise<CaseConfigure> => {
  const response = await KibanaServices.get().http.fetch<CasesConfigureResponse>(
    CASE_CONFIGURE_URL,
    {
      method: 'POST',
      body: JSON.stringify(caseConfiguration),
      signal,
    }
  );
  return convertToCamelCase<CasesConfigureResponse, CaseConfigure>(
    decodeCaseConfigureResponse(response)
  );
};

export const patchCaseConfigure = async (
  id: string,
  caseConfiguration: CasesConfigurePatch,
  signal: AbortSignal
): Promise<CaseConfigure> => {
  const response = await KibanaServices.get().http.fetch<CasesConfigureResponse>(
    getCaseConfigurationDetailsUrl(id),
    {
      method: 'PATCH',
      body: JSON.stringify(caseConfiguration),
      signal,
    }
  );
  return convertToCamelCase<CasesConfigureResponse, CaseConfigure>(
    decodeCaseConfigureResponse(response)
  );
};

export const fetchActionTypes = async ({ signal }: ApiProps): Promise<ActionTypeConnector[]> => {
  const response = await KibanaServices.get().http.fetch(ACTION_TYPES_URL, {
    method: 'GET',
    signal,
  });

  return response;
};
