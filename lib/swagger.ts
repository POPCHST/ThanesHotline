// import swaggerJsdoc from "swagger-jsdoc";

// export const swaggerSpec = swaggerJsdoc({
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Hotline API",
//       version: "1.0.0",
//       description: "Hotline / Ticket Management API",
//     },
//     servers: [
//       {
//         url: process.env.NEXT_PUBLIC_API_BASE_URL || "https://thanes-hotline.vercel.app/apidocs",
//         description: "API server",
//       },
//     ],
//   },
//   apis: ["./app/api/**/*.ts"],
// });

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Hotline API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://thanes-hotline.vercel.app",
    },
  ],
  paths: {
    "/api/customers": {
      get: {
        summary: "Get customers list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },

    "/api/departments": {
      get: {
        summary: "Get departments list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },

    "/api/devices": {
      get: {
        summary: "Get devices list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },

    "/api/getTickets": {
      get: {
        summary: "Get tickets with filters",
        tags: ["Get"],
        parameters: [
          {
            in: "query",
            name: "date_from",
            schema: {
              type: "string",
              format: "date",
            },
            description: "Start date (yyyy-mm-dd)",
            example: "2025-12-01",
          },
          {
            in: "query",
            name: "date_to",
            schema: {
              type: "string",
              format: "date",
            },
            description: "End date (yyyy-mm-dd)",
            example: "2025-12-17",
          },
          {
            in: "query",
            name: "status_code",
            schema: {
              type: "string",
            },
            description: "Ticket status",
            example: "OPEN",
          },
          {
            in: "query",
            name: "keyword",
            schema: {
              type: "string",
            },
            description: "Search by ticket_no",
            example: "TCK-20251217",
          },
        ],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ticket_id: { type: "integer" },
                      ticket_no: { type: "string" },
                      issue_title: { type: "string" },
                      priority_code: { type: "string" },
                      status_code: { type: "string" },
                      department_id: { type: "integer" },
                      opened_at: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/issue-categories": {
      get: {
        summary: "Get issue list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },
    "/api/issue-types": {
      get: {
        summary: "Get issue list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },
    "/api/login": {
      post: {
        summary: "User login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["username", "password", "department_id"],
                properties: {
                  username: {
                    type: "string",
                    example: "admin",
                  },
                  password: {
                    type: "string",
                    example: "123456",
                  },
                  department_id: {
                    type: "integer",
                    example: 10,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Login success",
                    },
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                    user: {
                      type: "object",
                      properties: {
                        user_id: {
                          type: "integer",
                          example: 1,
                        },
                        username: {
                          type: "string",
                          example: "admin",
                        },
                        full_name: {
                          type: "string",
                          example: "System Admin",
                        },
                        role_id: {
                          type: "integer",
                          example: 1,
                        },
                        department_id: {
                          type: "integer",
                          example: 10,
                        },
                        department_code: {
                          type: "string",
                          example: "IT",
                        },
                        department_name: {
                          type: "string",
                          example: "IT Department",
                        },
                      },
                    },
                  },
                },
              },
            },
          },

          400: {
            description: "username, password and department_id are required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "username, password and department_id are required",
                    },
                  },
                },
              },
            },
          },

          401: {
            description: "Invalid username or password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid username or password",
                    },
                  },
                },
              },
            },
          },

          403: {
            description: "User or department inactive",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Department is inactive",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/roles": {
      get: {
        summary: "Get roles list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },
    "/api/tag-status": {
      get: {
        summary: "Get tag-status list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },
    "/api/ticket-status": {
      get: {
        summary: "Get ticket-status list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },
    "/api/transit-tickets": {
      post: {
        summary:
          "Create customer, device and ticket in one transaction (auto-generated IDs)",
        tags: ["Insert"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "customer_name",
                  "customer_ward",
                  "contact_name",
                  "contact_phone",
                  "device_name",
                  "issue_title",
                  "issue_detail",
                  "priority_code",
                  "department_id",
                  "created_by",
                ],
                properties: {
                  // ===== customer =====
                  customer_name: {
                    type: "string",
                    example: "ห้องยา ICU",
                  },
                  customer_ward: {
                    type: "string",
                    example: "ICU",
                  },
                  contact_name: {
                    type: "string",
                    example: "พยาบาลสมศรี",
                  },
                  contact_phone: {
                    type: "string",
                    example: "0812345678",
                  },

                  // ===== device =====
                  device_name: {
                    type: "string",
                    example: "เครื่องนับยา YUYAMA",
                  },

                  // ===== ticket =====
                  issue_type_id: {
                    type: "integer",
                    example: 3,
                  },
                  tag_id: {
                    type: "integer",
                    example: 4,
                  },
                  issue_title: {
                    type: "string",
                    example: "เครื่องนับยาไม่ดูดเม็ดยา",
                  },
                  issue_detail: {
                    type: "string",
                    example: "เครื่องหยุดทำงานหลังเปิด 5 นาที",
                  },
                  priority_code: {
                    type: "string",
                    example: "HIGH",
                  },
                  impact_level: {
                    type: "string",
                    example: "HIGH",
                  },
                  urgency_level: {
                    type: "string",
                    example: "URGENT",
                  },
                  department_id: {
                    type: "integer",
                    example: 2,
                  },
                  created_by: {
                    type: "integer",
                    example: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Customer, Device and Ticket created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "Customer, Device and Ticket created successfully",
                    },
                    customer_id: {
                      type: "integer",
                      example: 15,
                    },
                    device_id: {
                      type: "integer",
                      example: 7,
                    },
                    ticket_no: {
                      type: "string",
                      example: "TCK-20251218101530-12",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
          },
          500: {
            description: "Transaction failed / Internal server error",
          },
        },
      },
    },

    "/api/users": {
      get: {
        summary: "Get Users list",
        tags: ["Master"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      user_id: { type: "integer" },
                      username: { type: "string" },
                      full_name: { type: "string" },
                      role_id: { type: "integer" },
                      department_id: { type: "integer" },
                      is_active: { type: "integer" },
                      created_at: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      post: {
        summary: "Create new user",
        tags: ["Insert"],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["username", "full_name", "password"],
                properties: {
                  username: {
                    type: "string",
                    example: "admin",
                  },
                  full_name: {
                    type: "string",
                    example: "Admin Dev",
                  },
                  password: {
                    type: "string",
                    example: "123456",
                  },
                  role_id: {
                    type: "integer",
                    example: 1,
                  },
                  department_id: {
                    type: "integer",
                    example: 1,
                  },
                  is_active: {
                    type: "integer",
                    example: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User created successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "username, full_name and password are required",
          },
          409: {
            description: "username already exists",
          },
        },
      },
    },
    "/api/ticketLogs": {
      get: {
        summary: "Get ticket logs list",
        tags: ["Logs"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      log_id: { type: "integer" },
                      ticket_id: { type: "integer" },
                      action_type: { type: "string" },
                      old_value: { type: "string", nullable: true },
                      new_value: { type: "string", nullable: true },
                      action_by: { type: "integer", nullable: true },
                      action_at: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      post: {
        summary: "Insert ticket action log",
        tags: ["Logs"],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["ticket_id", "action_type"],
                properties: {
                  ticket_id: {
                    type: "integer",
                    example: 1,
                  },
                  action_type: {
                    type: "string",
                  },
                  old_value: {
                    type: "string",
                    nullable: true,
                  },
                  new_value: {
                    type: "string",
                    nullable: true,
                  },
                  action_by: {
                    type: "integer",
                    example: 5,
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Ticket log created successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "ticket_id and action_type are required",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/api/ticket-forwards": {
      post: {
        summary: "Forward ticket to another department",
        tags: ["Forward"],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: [
                  "ticket_id",
                  "from_department_id",
                  "to_department_id",
                ],
                properties: {
                  ticket_id: {
                    type: "integer",
                  },
                  from_department_id: {
                    type: "integer",
                  },
                  to_department_id: {
                    type: "integer",
                  },
                  reason: {
                    type: "string",
                    example: "ส่งต่อให้ IT ตรวจสอบระบบ",
                    nullable: true,
                  },
                  forward_by: {
                    type: "string",
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Ticket forwarded successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "ticket_id, from_department_id, to_department_id are required",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/ticket-sla": {
      get: {
        summary: "Get ticket SLA by ticket_id",
        tags: ["SLA"],
        parameters: [
          {
            in: "query",
            name: "ticket_id",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  nullable: true,
                  properties: {
                    ticket_id: { type: "integer" },
                    start_time: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    first_response_time: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    resolve_time: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    is_breach: {
                      type: "integer",
                      example: 0,
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "ticket_id is required",
          },
        },
      },

      post: {
        summary: "Create or update ticket SLA",
        tags: ["SLA"],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["ticket_id"],
                properties: {
                  ticket_id: {
                    type: "integer",
                    example: 1,
                  },
                  start_time: {
                    type: "string",
                    format: "date-time",
                    nullable: true,
                  },
                  first_response_time: {
                    type: "string",
                    format: "date-time",
                    nullable: true,
                  },
                  resolve_time: {
                    type: "string",
                    format: "date-time",
                    nullable: true,
                  },
                  is_breach: {
                    type: "integer",
                    example: 0,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Ticket SLA saved successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "ticket_id is required",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
};
