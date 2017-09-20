import { handleActions, combineActions } from 'redux-actions';
import { set, assign, del } from 'object-path-immutable';
import { get } from 'lodash';
import { createAsset, setAssetValue, removeAsset, setAssets, resetAssets } from '../actions/assets';
import { getId } from '../../lib/get_id.js';

export default handleActions({
  [createAsset]: (assetState, { payload }) => {
    const asset = {
      id: getId('asset'),
      '@created': (new Date()).toISOString(),
      ...payload,
    };
    return set(assetState, asset.id, asset);
  },

  [setAssetValue]: (assetState, { payload }) => {
    const { id, value } = payload;
    const asset = get(assetState, [id]);
    if (!asset) throw new Error(`Can not set asset data, id not found: ${id}`);
    return assign(assetState, id, { value });
  },

  [removeAsset]: (assetState, { payload: assetId }) => {
    return del(assetState, assetId);
  },

  [combineActions(setAssets, resetAssets)]: (assetState, { payload }) => payload || {},
}, {});
