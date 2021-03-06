// Code generated by go-swagger; DO NOT EDIT.

package service_default_resource

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	"github.com/keptn/keptn/configuration-service/models"
)

// PostProjectProjectNameServiceServiceNameResourceCreatedCode is the HTTP code returned for type PostProjectProjectNameServiceServiceNameResourceCreated
const PostProjectProjectNameServiceServiceNameResourceCreatedCode int = 201

/*PostProjectProjectNameServiceServiceNameResourceCreated Success. Service default resource has been created. The version of the new configuration is returned.

swagger:response postProjectProjectNameServiceServiceNameResourceCreated
*/
type PostProjectProjectNameServiceServiceNameResourceCreated struct {

	/*
	  In: Body
	*/
	Payload *models.Version `json:"body,omitempty"`
}

// NewPostProjectProjectNameServiceServiceNameResourceCreated creates PostProjectProjectNameServiceServiceNameResourceCreated with default headers values
func NewPostProjectProjectNameServiceServiceNameResourceCreated() *PostProjectProjectNameServiceServiceNameResourceCreated {

	return &PostProjectProjectNameServiceServiceNameResourceCreated{}
}

// WithPayload adds the payload to the post project project name service service name resource created response
func (o *PostProjectProjectNameServiceServiceNameResourceCreated) WithPayload(payload *models.Version) *PostProjectProjectNameServiceServiceNameResourceCreated {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the post project project name service service name resource created response
func (o *PostProjectProjectNameServiceServiceNameResourceCreated) SetPayload(payload *models.Version) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PostProjectProjectNameServiceServiceNameResourceCreated) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(201)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// PostProjectProjectNameServiceServiceNameResourceBadRequestCode is the HTTP code returned for type PostProjectProjectNameServiceServiceNameResourceBadRequest
const PostProjectProjectNameServiceServiceNameResourceBadRequestCode int = 400

/*PostProjectProjectNameServiceServiceNameResourceBadRequest Failed. Service default resource could not be created.

swagger:response postProjectProjectNameServiceServiceNameResourceBadRequest
*/
type PostProjectProjectNameServiceServiceNameResourceBadRequest struct {

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewPostProjectProjectNameServiceServiceNameResourceBadRequest creates PostProjectProjectNameServiceServiceNameResourceBadRequest with default headers values
func NewPostProjectProjectNameServiceServiceNameResourceBadRequest() *PostProjectProjectNameServiceServiceNameResourceBadRequest {

	return &PostProjectProjectNameServiceServiceNameResourceBadRequest{}
}

// WithPayload adds the payload to the post project project name service service name resource bad request response
func (o *PostProjectProjectNameServiceServiceNameResourceBadRequest) WithPayload(payload *models.Error) *PostProjectProjectNameServiceServiceNameResourceBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the post project project name service service name resource bad request response
func (o *PostProjectProjectNameServiceServiceNameResourceBadRequest) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PostProjectProjectNameServiceServiceNameResourceBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

/*PostProjectProjectNameServiceServiceNameResourceDefault Error

swagger:response postProjectProjectNameServiceServiceNameResourceDefault
*/
type PostProjectProjectNameServiceServiceNameResourceDefault struct {
	_statusCode int

	/*
	  In: Body
	*/
	Payload *models.Error `json:"body,omitempty"`
}

// NewPostProjectProjectNameServiceServiceNameResourceDefault creates PostProjectProjectNameServiceServiceNameResourceDefault with default headers values
func NewPostProjectProjectNameServiceServiceNameResourceDefault(code int) *PostProjectProjectNameServiceServiceNameResourceDefault {
	if code <= 0 {
		code = 500
	}

	return &PostProjectProjectNameServiceServiceNameResourceDefault{
		_statusCode: code,
	}
}

// WithStatusCode adds the status to the post project project name service service name resource default response
func (o *PostProjectProjectNameServiceServiceNameResourceDefault) WithStatusCode(code int) *PostProjectProjectNameServiceServiceNameResourceDefault {
	o._statusCode = code
	return o
}

// SetStatusCode sets the status to the post project project name service service name resource default response
func (o *PostProjectProjectNameServiceServiceNameResourceDefault) SetStatusCode(code int) {
	o._statusCode = code
}

// WithPayload adds the payload to the post project project name service service name resource default response
func (o *PostProjectProjectNameServiceServiceNameResourceDefault) WithPayload(payload *models.Error) *PostProjectProjectNameServiceServiceNameResourceDefault {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the post project project name service service name resource default response
func (o *PostProjectProjectNameServiceServiceNameResourceDefault) SetPayload(payload *models.Error) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PostProjectProjectNameServiceServiceNameResourceDefault) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(o._statusCode)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
