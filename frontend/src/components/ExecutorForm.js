import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { API_URL } from "../index";


const ExecutorForm = (props) => {
    const [executor, setExecutor] = useState([]);

    const onChange = (e) => {
        const newState = executor;
        if (e.target.name === 'file') {
            newState[e.target.name] = e.target.files[0]
        } else newState[e.target.name] = e.target.value
        setExecutor(newState)
    }

    useEffect(() => {
        if (!props.newExecutor) {
            setExecutor(executor => props.executor)
        }
    }, [props.executor])

    const defaultEmpty = value => {
        return value === "" ? "" : value;
    }

    const submitDataEdit = async (e) => {
        e.preventDefault();

        const result = await axios.put(API_URL + '/executors/' + executor.pk, executor,
        {headers: {'Content-Type': 'multipath/form-data'}})
        .then(() => {
            props.resetState()
            props.toggle()
        })
    }

    const submitDataAdd = async (e) => {
        e.preventDefault();
        const data = {
            name: executor['name'],
            email: executor['email'],
            pr_task: executor['pr_task'],
            photo: '/',
            file: executor['file']
        }

        const result = await axios.post(API_URL + '/executors/', data,
        {headers: {'Content-Type': 'multipart/form-data'}})
        .then(() => {
            props.resetState()
            props.toggle()
        })
    }

    return (
        <Form onSubmit={props.newExecutor ? submitDataAdd : submitDataEdit}>
            <FormGroup>
                <Label for='name'>Имя:</Label>
                <Input
                    type="text"
                    name='name'
                    onChange={onChange}
                    defaultValue={defaultEmpty(executor.name)}
                />
            </FormGroup>
            <FormGroup>
                <Label for='email'>Email</Label>
                <Input
                    type="email"
                    name="email"
                    onChange={onChange}
                    defaultValue={defaultEmpty(executor.email)}
                />
            </FormGroup>
            <FormGroup>
                <Label for='pr'>PR задачи</Label>
                <Input
                    type="text"
                    name="pr"
                    onChange={onChange}
                    defaultValue={defaultEmpty(executor.pr_task)}
                />
            </FormGroup>
            <FormGroup>
                <Label for='photo'>Фото:</Label>
                <Input
                    type="file"
                    name='file'
                    onChange={onChange}
                    accept="image/*"
                />
            </FormGroup>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button>Отправить</Button><Button onClick={props.toggle}>Отмена</Button>
            </div>
        </Form>
    );
}

export default ExecutorForm;