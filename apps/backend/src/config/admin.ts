import { Database, Resource } from '@adminjs/prisma';
import { prisma } from './database';

export async function createAdminConfig() {
  const dmmf = await prisma._loadedConnection?.getDMMF();
  
  return {
    databases: [
      new Database(prisma, { dmmf })
    ],
    resources: [
      {
        resource: { model: prisma.user, client: prisma },
        options: {
          properties: {
            password: {
              isVisible: { list: false, show: false, edit: true, filter: false },
            },
          },
          actions: {
            new: {
              before: async (request: any) => {
                if (request.payload?.password) {
                  const bcrypt = await import('bcryptjs');
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
            edit: {
              before: async (request: any) => {
                if (request.payload?.password) {
                  const bcrypt = await import('bcryptjs');
                  request.payload.password = await bcrypt.hash(request.payload.password, 10);
                }
                return request;
              },
            },
          },
        },
      },
      {
        resource: { model: prisma.post, client: prisma },
        options: {
          properties: {
            content: {
              type: 'richtext',
            },
          },
        },
      },
      {
        resource: { model: prisma.profile, client: prisma },
      },
      {
        resource: { model: prisma.category, client: prisma },
      },
      {
        resource: { model: prisma.tag, client: prisma },
      },
    ],
    rootPath: '/admin',
    branding: {
      companyName: 'Node Admin',
      softwareBrothers: false,
    },
  };
}
