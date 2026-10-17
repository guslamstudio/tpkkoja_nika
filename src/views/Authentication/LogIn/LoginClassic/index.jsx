import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { Link } from '/src/utils/router-compat.jsx';
import CommanFooter1 from '../../CommanFooter1';

//Image
import jampackImg from '../../../../assets/img/logo-light.svg';
import jampackImgDark from '../../../../assets/img/logo-dark.svg';
import { useTheme } from '../../../../utils/theme-provider/theme-provider';

const LoginClassic = (props) => {
    const [showPassword, setShowPassword] = useState(false);

    const { theme } = useTheme();

    const loginForm = useForm({
        defaultValues: {
            userName: "",
            password: "",
        },
        onSubmit: () => {
            props.history.push("/");
        },
    });

    return (
        <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
            <div className="hk-pg-body pt-0 pb-xl-0">
                <Container>
                    <Row>
                        <Col sm={10} className="position-relative mx-auto">
                            <div className="auth-content py-8">
                                <Form className="w-100" onSubmit={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    loginForm.handleSubmit();
                                }}>
                                    <Row>
                                        <Col lg={5} md={7} sm={10} className="mx-auto">
                                            <div className="text-center mb-7">
                                                <Link to="/" className="navbar-brand me-0">
                                                    {theme === "light" ? <img src={jampackImg} alt="brand" className="brand-img d-inline-block" /> : <img src={jampackImgDark} alt="brand" className="brand-img d-inline-block" />}
                                                </Link>
                                            </div>
                                            <Card className="card-lg card-border">
                                                <Card.Body>
                                                    <h4 className="mb-4 text-center">Sign in to your account</h4>
                                                    <Row className="gx-3">
                                                        <Col as={Form.Group} lg={12} className="mb-3">
                                                            <div className="form-label-group">
                                                                <Form.Label>User Name</Form.Label>
                                                            </div>
                                                            <loginForm.Field name="userName">
                                                                {(field) => (
                                                                    <Form.Control placeholder="Enter username or email ID" type="text" value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} />
                                                                )}
                                                            </loginForm.Field>
                                                        </Col>
                                                        <Col as={Form.Group} lg={12} className="mb-3">
                                                            <div className="form-label-group">
                                                                <Form.Label>Password</Form.Label>
                                                                <Link to="#" className="fs-7 fw-medium">Forgot Password ?</Link>
                                                            </div>
                                                            <InputGroup className="password-check">
                                                                <span className="input-affix-wrapper">
                                                                    <loginForm.Field name="password">
                                                                        {(field) => (
                                                                            <Form.Control placeholder="Enter your password" value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} type={showPassword ? "text" : "password"} />
                                                                        )}
                                                                    </loginForm.Field>
                                                                    <Link to="#" className="input-suffix text-muted" onClick={() => setShowPassword(!showPassword)} >
                                                                        <span className="feather-icon">
                                                                            {
                                                                                showPassword
                                                                                    ?
                                                                                    <EyeOff className="form-icon" />
                                                                                    :
                                                                                    <Eye className="form-icon" />
                                                                            }

                                                                        </span>
                                                                    </Link>
                                                                </span>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <div className="d-flex justify-content-center">
                                                        <Form.Check id="logged_in" className="form-check-sm mb-3" >
                                                            <Form.Check.Input type="checkbox" defaultChecked />
                                                            <Form.Check.Label className="text-muted fs-7">Keep me logged in</Form.Check.Label>
                                                        </Form.Check>
                                                    </div>
                                                    <Button variant="primary" type="submit" className="btn-uppercase btn-block">Login</Button>
                                                    <p className="p-xs mt-2 text-center">New to Jmapack ? <Link to="#"><u>Create new account</u></Link></p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* Page Footer */}
            <CommanFooter1 />
        </div>

    )
}

export default LoginClassic
