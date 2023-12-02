import PropTypes from 'prop-types';

import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, setTasks, reRenderPage, setReRenderPage }) {
    return (
        <div className="mt-[4px]">
            {tasks.map((task) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    tasks={tasks}
                    setTasks={setTasks}
                    reRenderPage={reRenderPage}
                    setReRenderPage={setReRenderPage}                    
                />
            ))}
        </div>
    );
}

TaskList.propTypes = {
    reRenderPage: PropTypes.bool,
    setReRenderPage: PropTypes.func,
    setTasks: PropTypes.func,
    tasks: PropTypes.array.isRequired,
};

export default TaskList;
