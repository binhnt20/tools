export enum QueueProcessor {
  Partition = 'partition-queue',
  LOG = 'log-queue',
  ISP = 'isp-queue',
  OLD_DB = 'old-db-queue',
  ADMIN = 'admin-queue',
  CUSTOMER_IO = 'customer-io',
  USER_ACTIVITY = 'user-activity',
  ORDER = 'order-queue',
  FILE = 'file-queue',
  CATEGORIES = 'categories-queue',
  VISITOR_EVENT = 'visitor-event-queue',
}

export enum PartitionQueueProcess {
  PartitionDatabase = 'partition-database-process',
  DropPartitionDatabase = 'drop-partition-database',
  PartitionOrderDatabase = 'partition-order-process',
  DropPartitionOrderDatabase = 'drop-partition-order',
}

export enum LogQueueProcess {
  IP_ACCESS = 'ip-access-log',
  IP_ACCESS_NEW_TABLE = 'ip-access-log-new-table',
  SAVE_INFO_IP_CHECKED = 'save-info-ip-checked',
  SaveIpAllowedAccess = 'va-ip-allowed-access',
  SaveIpBlockedAccess = 'va-ip-blocked-access',
  CHECK_AND_UPDATE_OVER_QUOTA = 'check-and-update-over-quota',
  CHECK_SUMMARY_WEEKLY = 'check-va-summary-weekly',
}

export enum IspQueueProcess {
  INSERT_COUNTRY = 'insert-country-isp',
  INSERT_DETAIL = 'insert-detail-isp',
  UPDATE_COUNTRY_NAME_FOR_CITIES = 'update-country-name-for-cities',
}

export enum AdminQueue {
  UPDATE_REPORT = 'update-admin-report',
  UPDATE_TOTAL_COUNTRY = 'update-total-country',
  MIGRATION_SETTING_METAFIELDS = 'migration-setting-metafields',
}

export enum CustomerIoQueue {
  SEND_EVENT = 'send-event',
  REGISTER = 'register',
  REMOVE = 'remove',
  UPDATE_ATTRIBUTE = 'update-attribute',
}

export enum UserActivityQueue {
  ADD_NEW_USER_ACTIVITY = 'add-new-user-activity',
  REMOVE_USER_ACTIVITY = 'remove-user-activity',
}

export enum OrderQueue {
  REMOVE_ORDER_USER_UNINSTALL = 'remove-order-user-uninstall',
  HANDLE_WEBHOOK = 'handle-webhook-order',
  ADD_TAG_ORDER = 'add-tag-order',
}

export enum FileQueueProcess {
  REMOVE_STORE_FILE_ERRORS = 'remove-store-file-errors-created-when-add-rules',
}

export enum GetCategoriesProcessor {
  GET_CATEGORIES = 'get-categories',
}

export enum VisitorEventQueue {
  CHECKOUT_STARTED = 'checkout-started',
  CHECKOUT_COMPLETED = 'checkout-completed',
  CHECKOUT_ERROR = 'checkout-error',
  ALERT_CHECKOUT_UI = 'alert-checkout-ui'
  // VISIT_PAGE = 'visit-page',
}
