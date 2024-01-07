import {
    Container, Row, Col, Card, CardBody, Button,
    Form,FormGroup, Label, Input
} from 'reactstrap';

const Login = (props) => {
    let loginHandler = props.onSubmit;
    let setUsername = props.setFormUsername;
    let setPassword = props.setFormPassword;

    return(
        <Container style={{'maxWidth': 500, 'padding': 20}}>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Form onSubmit={loginHandler}>
                                <FormGroup className='pb-2 mr-sm-2 mb-sm-0'>
                                    <Label for='username' className='mr-sm-2'>Имя пользователя</Label>
                                    <Input type='text' name='email' id='username'
                                    onChange={(ev) => setUsername(ev.currentTarget.value)}
                                    />
                                </FormGroup>
                                <FormGroup className='pb-2 mr-sm-2 mb-sm-0'>
                                    <Label for='password' className='mr-sm-2'>Пароль</Label>
                                    <Input type='password' name='password' id='password'
                                    onChange={(ev) => setPassword(ev.currentTarget.value)}
                                    />
                                </FormGroup>
                                <Button type='submit' color='primary'>
                                    Войти
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;