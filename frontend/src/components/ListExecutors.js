import { Table } from 'reactstrap';
import ModalExecutor from './ModalExecutor';
import AppRemoveExecutor from './appRemoveExecutor';
import ModalPhoto from './ModalPhoto';


const ListExecutors = (props) => {
    const { executors } = props
    return (
        <Table>
            <thead>
                <tr>
                    <th>Испольнитель</th>
                    <th>PR-задачи</th>
                    <th>Описание</th>
                    <th>Фото</th>
                    <th>Опубликован</th>
                </tr>
            </thead>
            <tbody>
                { !executors || executors.length <= 0 ? (
                    <tr>
                        <td colSpan='6' align='center'>
                            Пусто
                        </td>
                    </tr>
                ) : executors.map(executor => (
                    <tr key={executor.pk}>
                        <td>{executor.name}</td>
                        <td>{executor.pr_task}</td>
                        <td>{executor.description}</td>
                        <td><ModalPhoto
                            executor={executor}
                        /></td>
                        <td>
                            <ModalExecutor
                                create={false}
                                executor={executor}
                                resetState={props.resetState}
                                newExecutor={props.newExecutor}
                            />
                            &nbsp;&nbsp;
                            <AppRemoveExecutor
                                pk={executor.pk}
                                resetState={props.resetState}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default ListExecutors;