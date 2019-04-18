import * as express from 'express';
import { inject, injectable } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  interfaces,
  httpDelete,
} from 'inversify-express-utils';
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
  ApiOperationDelete,
} from 'swagger-express-ts';
import { MessageService } from '../svc/MessageService';
import { WebSocketService } from '../svc/WebSocketService';

const uuidv4 = require('uuid/v4');

@ApiPath({
  name: 'Service',
  path: '/service',
  security: { apiKeyHeader: ['x-keptn-signature'] },
})
@controller('/service')
export class ServiceController implements interfaces.Controller {

  @inject('MessageService') private readonly messageService: MessageService;

  @ApiOperationPost({
    description: 'Onboards a new service to a keptn project',
    parameters: {
      body: {
        description: 'Service information',
        model: 'ServiceRequestModel',
        required: true,
      },
    },
    responses: {
      200: {
      },
      400: { description: 'Parameters fail' },
    },
    summary: 'Onboard a new service to a keptn project',
  })
  @httpPost('/')
  public async onboardService(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    const keptnContext = uuidv4();
    const result = request.body;

    const channelInfo = await WebSocketService.getInstance().createChannel(keptnContext);
    if (result && result.data !== undefined) {
      result.data.channelInfo = channelInfo;
      result.shkeptncontext = keptnContext;
    }
    result.data.success = await this.messageService.sendMessage(result);
    response.send(request.body);
  }

  @ApiOperationDelete({
    description: 'Delete a project',
    parameters: {

    },
    responses: {
      200: {
      },
      400: { description: 'Parameters fail' },
    },
    summary: 'Delete a keptn project',
  })
  @httpDelete('/')
  public deleteService(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): void {
    const result = {
      result: 'success',
    };

    response.send(result);
  }
}