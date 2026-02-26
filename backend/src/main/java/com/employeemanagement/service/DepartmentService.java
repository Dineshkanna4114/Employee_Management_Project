package com.employeemanagement.service;

import com.employeemanagement.dto.DepartmentDTO;
import com.employeemanagement.entity.Department;
import com.employeemanagement.exception.ResourceNotFoundException;
import com.employeemanagement.repository.DepartmentRepository;
import com.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toDTOWithCount)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return toDTOWithCount(dept);
    }

    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Department with name '" + dto.getName() + "' already exists");
        }
        Department dept = Department.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return toDTO(departmentRepository.save(dept));
    }

    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (!dept.getName().equals(dto.getName()) && departmentRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Department with name '" + dto.getName() + "' already exists");
        }

        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        return toDTO(departmentRepository.save(dept));
    }

    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        List<?> employees = employeeRepository.findByDepartmentId(id);
        if (!employees.isEmpty()) {
            throw new RuntimeException("Cannot delete department with existing employees. Reassign employees first.");
        }

        departmentRepository.delete(dept);
    }

    private DepartmentDTO toDTO(Department dept) {
        return DepartmentDTO.builder()
                .id(dept.getId())
                .name(dept.getName())
                .description(dept.getDescription())
                .build();
    }

    private DepartmentDTO toDTOWithCount(Department dept) {
        long count = employeeRepository.findByDepartmentId(dept.getId()).size();
        return DepartmentDTO.builder()
                .id(dept.getId())
                .name(dept.getName())
                .description(dept.getDescription())
                .employeeCount(count)
                .build();
    }
}
