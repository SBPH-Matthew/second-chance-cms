export type GetCategoryGroupsResponse = {
  message: string;
  category_groups: CategoryGroup[];
};

export type GetCategoryStatusesResponse = {
  message: string;
  category_statuses: CategoryStatus[];
};

export type CreateCategoryResponse = {
  message: string;
  category: {
    id: number;
    name: string;
    status: string;
    category_group: string;
  };
};

export type CategoryPaginationResponse = {
  message: string;
  categories: {
    total: number;
    items: Array<CategoryListType>;
  };
};

export type CategoryListType = {
  id: number;
  name: string;
  status: number;
  category_group: number;
};

export type CategoryGroup = {
  id: number;
  name: string;
};

export type CategoryStatus = {
  id: number;
  name: string;
};
