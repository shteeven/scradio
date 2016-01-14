'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('hosts', ['core']);
ApplicationConfiguration.registerModule('hosts.admin', ['core.admin']);
ApplicationConfiguration.registerModule('hosts.admin.routes', ['core.admin.routes']);
