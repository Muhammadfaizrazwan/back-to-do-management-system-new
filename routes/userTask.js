var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All Users Task
router.get('/get-all', async function (req, res) {
  try {
    const userTasks = await prisma.userTask.findMany();
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Task by ID
router.get('/get-user-task/:user_id/:task_id', async function (req, res) {
  const { user_id, task_id } = req.params;
  try {
    const userTask = await prisma.userTask.findUnique({
      where: {
        user_id_task_id: {
          user_id: parseInt(user_id),
          task_id: parseInt(task_id),
        },
      },
    });

    if (!userTask) {
      return res.status(404).json({ error: 'User Task not found' });
    }

    res.json(userTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create User Task
router.post('/create', async function (req, res) {
  const { user_id, task_id } = req.body;

  try {
    // Cek apakah user dan task ada
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(user_id) },
    });

    const taskExists = await prisma.task.findUnique({
      where: { id: parseInt(task_id) },
    });

    if (!userExists || !taskExists) {
      return res.status(400).json({ error: 'User or Task not found' });
    }

    const userTask = await prisma.userTask.create({
      data: {
        user_id: parseInt(user_id),
        task_id: parseInt(task_id),
      },
    });

    res.status(201).json(userTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Task
router.put('/update-user-task/:user_id_param/:task_id_param', async function (req, res) {
  const { user_id_param, task_id_param } = req.params;
  const { user_id, task_id } = req.body;

  try {
    // Cek apakah user task yang ingin diperbarui ada
    const userTaskExists = await prisma.userTask.findUnique({
      where: {
        user_id_task_id: {
          user_id: parseInt(user_id_param),
          task_id: parseInt(task_id_param),
        },
      },
    });

    if (!userTaskExists) {
      return res.status(404).json({ error: 'User Task not found' });
    }

    // Cek apakah user dan task yang baru valid
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(user_id) },
    });

    const taskExists = await prisma.task.findUnique({
      where: { id: parseInt(task_id) },
    });

    if (!userExists || !taskExists) {
      return res.status(400).json({ error: 'New User or Task not found' });
    }

    const userTask = await prisma.userTask.update({
      where: {
        user_id_task_id: {
          user_id: parseInt(user_id_param),
          task_id: parseInt(task_id_param),
        },
      },
      data: {
        user_id: parseInt(user_id),
        task_id: parseInt(task_id),
      },
    });

    res.json(userTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User Task
router.delete('/delete/:user_id/:task_id', async function (req, res) {
  const { user_id, task_id } = req.params;

  try {
    // Cek apakah user task ada sebelum dihapus
    const userTaskExists = await prisma.userTask.findUnique({
      where: {
        user_id_task_id: {
          user_id: parseInt(user_id),
          task_id: parseInt(task_id),
        },
      },
    });

    if (!userTaskExists) {
      return res.status(404).json({ error: 'User Task not found' });
    }

    await prisma.userTask.delete({
      where: {
        user_id_task_id: {
          user_id: parseInt(user_id),
          task_id: parseInt(task_id),
        },
      },
    });

    res.json({ message: 'User Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
