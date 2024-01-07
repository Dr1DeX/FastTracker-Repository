import {Container, Row, Col} from 'reactstrap';
import ListExecutors from './ListExecutors';
import ModalExecutor from './ModalExecutor';

const Home = (props) => {
    let executors = props.executors;
    let resetState = props.resetState;

    return(
        <Container style={{marginTop: '20px'}}>
            <Row>
                <Col>
                    <ListExecutors executors={executors} resetState={resetState} newExecutor={false}/>

                </Col>
            </Row>
            <Row>
                <Col>
                    <ModalExecutor
                    create={true}
                    resetState={resetState}
                    newExecutor={true}/>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;