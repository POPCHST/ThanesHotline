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
  // servers: [
  //   {
  //     url:
  //       process.env.NEXT_PUBLIC_API_BASE_URL ||
  //       "https://thanes-hotline.vercel.app",
  //     description: "API server",
  //   },
  // ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
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
                required: ["username", "password"],
                properties: {
                  username: {
                    type: "string",
                    example: "admin",
                  },
                  password: {
                    type: "string",
                    example: "123456",
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
            description: "username and password are required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "username and password are required",
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
                      example: "User or department inactive",
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
    "/api/ticket-status-service": {
      get: {
        summary: "Get ticket-status-service list",
        tags: ["Master"],
        responses: {
          200: { description: "Success" },
        },
      },
    },
    "/api/transit-tickets": {
      post: {
        summary:
          "Create customer, device and ticket (IT or Service) in one transaction (auto-generated IDs)",
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
                    nullable: true,
                    example: 3,
                  },
                  tag_id: {
                    type: "integer",
                    nullable: true,
                    example: 4,
                  },

                  status_code: {
                    type: "string",
                    example: "open",
                    description:
                      "สถานะ ticket (ถ้าไม่ส่งมา ระบบจะตั้งค่าเริ่มต้นเป็น open)",
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
                    nullable: true,
                    example: "HIGH",
                  },
                  urgency_level: {
                    type: "string",
                    nullable: true,
                    example: "URGENT",
                  },

                  department_id: {
                    type: "integer",
                    example: 2,
                  },

                  assigned_user_id: {
                    type: "integer",
                    example: 6,
                  },

                  assigned_user_name: {
                    type: "string",
                    example: "user2",
                  },

                  created_by: {
                    type: "integer",
                    example: 1,
                    description: "user id ของผู้สร้าง ticket",
                  },

                  created_at: {
                    type: "string",
                    example: "2025-12-26 08:00",
                    description:
                      "วันที่และเวลาที่ต้องการสร้าง ticket (เวลาไทย YYYY-MM-DD HH:mm) ถ้าไม่ส่งมา ระบบจะใช้เวลาปัจจุบัน",
                  },

                  // ===== ★ service flag =====
                  is_service_case: {
                    type: "integer",
                    enum: [0, 1],
                    example: 0,
                    description: "0 = IT ปกติ, 1 = Service",
                  },

                  // ===== ★ service detail (optional) =====
                  service: {
                    type: "object",
                    nullable: true,
                    description:
                      "ข้อมูลเฉพาะ Service (ใช้เมื่อ is_service_case = 1)",
                    properties: {
                      service_types: {
                        type: "array",
                        items: { type: "string" },
                        example: ["repair", "replace"],
                      },
                      work_order_no: {
                        type: "string",
                        example: "WO-2025-0001",
                      },
                      cost_estimate: {
                        type: "number",
                        example: 1500,
                      },
                      serial_before: {
                        type: "string",
                        example: "SN-OLD-1234",
                      },
                      serial_after: {
                        type: "string",
                        example: "SN-NEW-5678",
                      },
                      replaced_parts: {
                        type: "string",
                        example: "Motor, Sensor",
                      },
                      service_note: {
                        type: "string",
                        example: "เปลี่ยนอะไหล่ + calibrate",
                      },
                    },
                  },

                  // ===== resolution =====
                  resolution_text: {
                    type: "string",
                    nullable: true,
                    example: "รีสตาร์ทเครื่องแล้วใช้งานได้ตามปกติ",
                    description:
                      "ข้อความสรุปการแก้ไข (optional) ถ้ามี ระบบจะสร้าง record ใน ticket_resolution",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "Customer, Device, Ticket, Service (optional) and Resolution created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "Customer, Device, Ticket and Resolution created successfully",
                    },
                    customer_id: {
                      type: "integer",
                      example: 15,
                    },
                    device_id: {
                      type: "integer",
                      example: 7,
                    },
                    ticket_id: {
                      type: "integer",
                      example: 1001,
                    },
                    ticket_no: {
                      type: "string",
                      example: "TCK-1735209600000",
                    },
                    is_service_case: {
                      type: "integer",
                      example: 1,
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
    "/api/ticket-delete": {
      put: {
        summary:
          "Soft delete ticket (update only is_deleted, deleted_at, deleted_by)",
        tags: ["Ticket"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ticket_no", "deleted_by"],
                properties: {
                  ticket_no: {
                    type: "string",
                    example: "TCK-1766819708852",
                  },
                  deleted_by: {
                    type: "integer",
                    example: 12,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Ticket deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ticket deleted successfully",
                    },
                    ticket_no: {
                      type: "string",
                      example: "TCK-1766819708852",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
          },
          404: {
            description: "Ticket not found or already deleted",
          },
          500: {
            description: "Delete ticket failed",
          },
        },
      },
    },
    "/api/ticket-update": {
      put: {
        summary: "Update ticket, customer, device, service and resolution",
        tags: ["Ticket"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ticket_no", "updated_by"],
                properties: {
                  ticket_no: {
                    type: "string",
                    example: "TCK-1766819708852",
                  },

                  // ===== customer =====
                  customer_name: {
                    type: "string",
                    nullable: true,
                    example: "ห้องยา ICU",
                  },
                  customer_ward: {
                    type: "string",
                    nullable: true,
                    example: "ICU",
                  },
                  contact_name: {
                    type: "string",
                    nullable: true,
                    example: "พยาบาลสมศรี",
                  },
                  contact_phone: {
                    type: "string",
                    nullable: true,
                    example: "0812345678",
                  },

                  // ===== device =====
                  device_name: {
                    type: "string",
                    nullable: true,
                    example: "เครื่องนับยา YUYAMA",
                  },

                  // ===== ticket =====
                  issue_type_id: {
                    type: "integer",
                    nullable: true,
                    example: 3,
                  },
                  tag_id: {
                    type: "integer",
                    nullable: true,
                    example: 4,
                  },
                  issue_title: {
                    type: "string",
                    nullable: true,
                    example: "เครื่องไม่ดูดเม็ดยา",
                  },
                  issue_detail: {
                    type: "string",
                    nullable: true,
                    example: "ทดสอบแล้วพบว่า sensor ค้าง",
                  },
                  priority_code: {
                    type: "string",
                    nullable: true,
                    example: "HIGH",
                  },
                  impact_level: {
                    type: "string",
                    nullable: true,
                    example: "HIGH",
                  },
                  urgency_level: {
                    type: "string",
                    nullable: true,
                    example: "URGENT",
                  },
                  department_id: {
                    type: "integer",
                    nullable: true,
                    example: 2,
                  },
                  assigned_user_name: {
                    type: "string",
                    nullable: true,
                    example: "user2",
                  },
                  status_code: {
                    type: "string",
                    nullable: true,
                    example: "in_progress",
                  },

                  // ===== service (optional) =====
                  service: {
                    type: "object",
                    nullable: true,
                    properties: {
                      service_types: {
                        type: "array",
                        items: { type: "string" },
                        example: ["repair", "replace"],
                      },
                      work_order_no: {
                        type: "string",
                        example: "WO-2025-0001",
                      },
                      cost_estimate: {
                        type: "number",
                        example: 1500,
                      },
                      serial_before: {
                        type: "string",
                        example: "SN-OLD-1234",
                      },
                      serial_after: {
                        type: "string",
                        example: "SN-NEW-5678",
                      },
                      replaced_parts: {
                        type: "string",
                        example: "Motor, Sensor",
                      },
                      service_note: {
                        type: "string",
                        example: "ติดตั้ง + PM",
                      },
                    },
                  },

                  // ===== resolution (update current resolution) =====
                  resolution_text: {
                    type: "string",
                    nullable: true,
                    example: "เปลี่ยน sensor และทดสอบเครื่องเรียบร้อย",
                    description: "ผลการแก้ไขล่าสุดของ ticket (update / upsert)",
                  },

                  // ===== audit =====
                  updated_by: {
                    type: "integer",
                    example: 12,
                  },
                  updated_at: {
                    type: "string",
                    nullable: true,
                    example: "2025-12-27 15:40",
                    description:
                      "วันที่และเวลาที่แก้ไข (ถ้าไม่ส่งมา ระบบจะใช้เวลาปัจจุบัน)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Ticket updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ticket updated successfully",
                    },
                    ticket_no: {
                      type: "string",
                      example: "TCK-1766819708852",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
          },
          404: {
            description: "Ticket not found",
          },
          500: {
            description: "Update ticket failed",
          },
        },
      },
    },

    "/api/tickets/{ticketId}/close": {
      post: {
        summary: "Close ticket and generate satisfaction token",
        tags: ["Rate"],
        parameters: [
          {
            name: "ticketId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 123,
            description: "ID ของ ticket ที่ต้องการปิด",
          },
        ],
        responses: {
          200: {
            description: "Ticket closed and satisfaction token created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ticket closed successfully",
                    },
                    ticket_id: {
                      type: "integer",
                      example: 123,
                    },
                    satisfaction_token: {
                      type: "string",
                      nullable: true,
                      example: "c8f9f7b4-0b4a-4e61-a45c-9cbb0c1e9c31",
                    },
                    survey_url: {
                      type: "string",
                      nullable: true,
                      example:
                        "https://thanes-hotline.vercel.app/satisfaction?token=c8f9f7b4-0b4a-4e61-a45c-9cbb0c1e9c31",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid ticket id",
          },
          409: {
            description: "Ticket already closed or not found",
          },
          500: {
            description: "Close ticket failed",
          },
        },
      },
    },
    "/api/satisfaction": {
      post: {
        summary: "Submit ticket satisfaction score",
        tags: ["Rate"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "score"],
                properties: {
                  token: {
                    type: "string",
                    example: "c8f9f7b4-0b4a-4e61-a45c-9cbb0c1e9c31",
                    description: "token ที่ได้จากการปิด ticket",
                  },
                  score: {
                    type: "integer",
                    minimum: 1,
                    maximum: 5,
                    example: 5,
                    description: "คะแนนความพึงพอใจ (1-5)",
                  },
                  comment: {
                    type: "string",
                    nullable: true,
                    example: "บริการดีมาก แก้ไขเร็ว",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Satisfaction submitted successfully",
          },
          400: {
            description: "Invalid or expired token",
          },
          409: {
            description: "Score already submitted",
          },
          500: {
            description: "Submit satisfaction failed",
          },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        summary: "Request password reset (Forgot password)",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["username"],
                properties: {
                  username: {
                    type: "string",
                    example: "admin",
                    description: "Username ที่ต้องการขอรีเซ็ตรหัสผ่าน",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Request accepted (do not reveal user existence)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "หากมีผู้ใช้งานในระบบ จะได้รับการติดต่อจากผู้ดูแล",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "username is required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "username is required",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        summary: "Reset password using reset token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                type: "object",
                required: ["token", "new_password"],
                properties: {
                  token: {
                    type: "string",
                    example: "a8f9c3e9d12a4f...",
                    description: "Reset token ที่ได้จาก forgot-password",
                  },
                  new_password: {
                    type: "string",
                    example: "123456",
                    description: "รหัสผ่านใหม่ (จะถูก hash ก่อนบันทึก)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ตั้งรหัสผ่านใหม่เรียบร้อย",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid or expired token",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "token ไม่ถูกต้องหรือหมดอายุแล้ว",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tickets/{ticketId}/reopen": {
      put: {
        summary: "Reopen closed ticket",
        description:
          "Reopen a ticket that has been closed. " +
          "All business logic is handled by the backend, including state validation, " +
          "status transition from close to open, incrementing reopen count, " +
          "and resetting closed/resolved timestamps. " +
          "Client only needs to trigger this action.",
        tags: ["Ticket"],
        parameters: [
          {
            name: "ticketId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 123,
            description: "Ticket ID to reopen",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["updated_by"],
                properties: {
                  updated_by: {
                    type: "integer",
                    example: 12,
                    description:
                      "User ID who triggers the reopen action (used for audit)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Ticket reopened successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ticket reopened successfully",
                    },
                    ticket_id: {
                      type: "integer",
                      example: 123,
                    },
                    reopen_count: {
                      type: "integer",
                      example: 2,
                      description:
                        "Total number of times this ticket has been reopened",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Ticket is not closed or missing required fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ticket is not closed",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Ticket not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "ticket not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Reopen ticket failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "reopen ticket failed",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ===============================
    // Notification
    // ===============================
    "/api/notifications": {
      get: {
        summary: "Get latest notifications of current user",
        tags: ["Notification"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of notifications",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 12 },
                      type: {
                        type: "string",
                        example: "assign_ticket",
                      },
                      ref_type: {
                        type: "string",
                        example: "ticket",
                      },
                      ref_id: {
                        type: "integer",
                        example: 49,
                      },
                      title: {
                        type: "string",
                        example: "มีงานใหม่ถูกมอบหมาย",
                      },
                      message: {
                        type: "string",
                        example:
                          "คุณได้รับมอบหมายงาน Ticket #TCK-1768446030607",
                      },
                      is_read: {
                        type: "integer",
                        example: 0,
                      },
                      created_at: {
                        type: "string",
                        example: "2026-01-15 12:44:54",
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },

    "/api/notifications/unread-count": {
      get: {
        summary: "Get unread notification count of current user",
        tags: ["Notification"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Unread notification count",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    unread: {
                      type: "integer",
                      example: 3,
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },

    "/api/notifications/read-all": {
      put: {
        summary: "Mark all notifications as read for current user",
        tags: ["Notification"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "All notifications marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "all notifications marked as read",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
  },
};
