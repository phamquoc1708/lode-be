import _ from "lodash";

export const getInfoData = ({ fields, object = {} }: { fields: Array<string>; object: object }) => {
  return _.pick(object, fields);
};
