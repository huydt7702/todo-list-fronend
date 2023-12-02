import PropTypes from 'prop-types';
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import EditTaskQuickView from '~/components/EditTaskQuickView';
import {
    CalendarIcon,
    CheckIcon,
    CheckSolidIcon,
    InputRadioIcon,
    StarIcon,
    StarSolidIcon,
    TrashIcon,
} from '~/components/Icons';
import * as taskService from '~/services/taskService';
import './tasksedit.css';

function TaskItem({ task, tasks, setTasks, reRenderPage, setReRenderPage }) {
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const handleCloseModal = () => setOpenModalEdit(false);

    const [taskIdToDelete, setTaskIdToDelete] = useState(null);

    const handleDelete = async (id) => {
        setTaskIdToDelete(id);
    };

    const confirmDelete = async () => {
        if (taskIdToDelete) {
            const data = await taskService.deleteTask(taskIdToDelete);
            if (data.success) {
                toast.success('Xóa công việc thành công');
            } else {
                toast.error('Xóa công việc thất bại!');
            }

            const tasksAfterDelete = tasks.filter((task) => task._id !== taskIdToDelete);
            setTasks(tasksAfterDelete);
        }

        setTaskIdToDelete(null);
    };

    const cancelDelete = () => {
        setTaskIdToDelete(null);
    };

    const handleMoveToImportant = (task) => {
        if (task.isImportant) {
            const formData = {
                isImportant: false,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
            toast.success('Đã gỡ công việc khỏi mục quan trọng');
        } else {
            const formData = {
                isImportant: true,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
            toast.success('Đã chuyển công việc vào mục quan trọng');
        }
    };

    const handleMoveToFinished = (task) => {
        if (task.isFinished) {
            const formData = {
                isFinished: false,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
            toast.success('Đã gỡ công việc khỏi mục hoàn thành');
        } else {
            const formData = {
                isFinished: true,
            };
            taskService.updateTask(formData, task._id);
            setReRenderPage(!reRenderPage);
            toast.success('Đã chuyển công việc vào mục hoàn thành');
        }
    };

    function removeNonBreakingSpaces(str) {
        return str?.replace(/&nbsp;/g, ' ');
    }

    const { data: label = {} } = useQuery({
        queryKey: ['getLabelById', task.labelId],
        queryFn: () => axios.get(`/v1/label/${task.labelId}`),
        enabled: !!task.labelId,
        select: ({ data: { data } }) => data,
    });

    return (
        <div>
            <ContextMenuTrigger id={task._id}>
                <div className="flex items-center shadow-sm px-[16px] mt-[8px] bg-white rounded-[4px] hover:bg-[#f5f5f5] cursor-pointer">
                    <button className="p-[6px] text-[#2564cf]" onClick={() => handleMoveToFinished(task)}>
                        {task.isFinished ? <CheckSolidIcon /> : <InputRadioIcon />}
                    </button>
                    <div className="px-[14px] py-[8px] w-full" onClick={() => setOpenModalEdit(true)}>
                        <p
                            className={`text-[14px] outline-none fixtask outline-offset-0 focus:outline-[#2564cf] ${
                                task.isFinished ? 'line-through' : 'no-underline'
                            }`}
                        >
                            {removeNonBreakingSpaces(task.name)}
                        </p>
                        <p className="text-[12px] text-[#605e5c]">{label.name || 'Tác vụ'}</p>
                    </div>
                    <span className="text-[#2564cf] px-[4px] py-[2px]" onClick={() => handleMoveToImportant(task)}>
                        {task.isImportant ? <StarSolidIcon /> : <StarIcon />}
                    </span>
                </div>
                <EditTaskQuickView
                    data={task}
                    openModal={openModalEdit}
                    handleCloseModal={handleCloseModal}
                    reRenderPage={reRenderPage}
                    setReRenderPage={setReRenderPage}
                />
            </ContextMenuTrigger>

            <ContextMenu id={task._id}>
                <div className="py-[6px] rounded-[4px] bg-white shadow-[rgba(0,0,0,0.133)_0px_3.2px_7.2px_0px]">
                    <ul>
                        <li
                            className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer"
                            onClick={() => handleMoveToImportant(task)}
                        >
                            <span className="mx-[4px]">
                                <StarIcon />
                            </span>
                            <span className="mx-[4px] px-[4px] text-[14px]">
                                {task.isImportant ? 'Loại bỏ mức độ quan trọng' : 'Đánhh dấu là quan trọng'}
                            </span>
                        </li>
                        <li className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer">
                            <span className="mx-[4px]">
                                <CheckIcon />
                            </span>
                            <span className="mx-[4px] px-[4px] text-[14px]" onClick={() => handleMoveToFinished(task)}>
                                {task.isFinished ? 'Đánh dấu là chưa hoàn thành' : 'Đánhh dấu là đã hoàn thành'}
                            </span>
                        </li>
                        <li className="flex items-center px-[12px] h-[36px] hover:bg-[#f5f5f5] cursor-pointer">
                            <span className="mx-[4px]">
                                <CalendarIcon />
                            </span>
                            <span className="mx-[4px] px-[4px] text-[14px]">Đặt thời hạn cho công việc này</span>
                        </li>
                        <li className="my-[6px] border-b border-solid border-[#e1dfdd] bg-[#e1dfdd]"></li>
                        <li
                            className="flex items-center px-[12px] h-[36px] text-[#a80000] hover:bg-[#f5f5f5] cursor-pointer"
                            onClick={() => handleDelete(task._id)}
                        >
                            <span className="mx-[4px]">
                                <TrashIcon />
                            </span>
                            <span className="mx-[4px] px-[4px] text-[14px]">Xóa tác vụ</span>
                        </li>
                    </ul>
                </div>
            </ContextMenu>

            {/* Modal Delele */}
            {taskIdToDelete === task._id && (
                <div>
                    <div className="overlay"></div>
                    <div className="confirmation-dialog">
                        <p className="confirm-h1">Bạn có chắc chắn muốn xóa?</p>

                        <div className="btn-container">
                            <p className="confirm-p">Xóa nhiệm vụ này!</p>

                            <button onClick={cancelDelete} className="cancel-btn">
                                Hủy
                            </button>
                            <button onClick={confirmDelete} className="confirm-btn">
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

TaskItem.propTypes = {
    task: PropTypes.object.isRequired,
    reRenderPage: PropTypes.bool,
    setReRenderPage: PropTypes.func,
    setTasks: PropTypes.func,
    tasks: PropTypes.array.isRequired,
};

export default TaskItem;
