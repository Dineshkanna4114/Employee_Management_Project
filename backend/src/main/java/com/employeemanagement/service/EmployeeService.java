package com.employeemanagement.service;

import com.employeemanagement.dto.DashboardStatsDTO;
import com.employeemanagement.dto.EmployeeDTO;
import com.employeemanagement.entity.Department;
import com.employeemanagement.entity.Employee;
import com.employeemanagement.entity.Employee.EmployeeStatus;
import com.employeemanagement.exception.ResourceNotFoundException;
import com.employeemanagement.repository.DepartmentRepository;
import com.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Page<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String sortDir,
            String search, Long departmentId, String status) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        EmployeeStatus employeeStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                employeeStatus = EmployeeStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }

        Page<Employee> employees = employeeRepository.findWithFilters(
                search != null && search.isEmpty() ? null : search,
                departmentId,
                employeeStatus,
                pageable);

        return employees.map(this::toDTO);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return toDTO(emp);
    }

    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }
        if (dto.getEmployeeId() != null && employeeRepository.existsByEmployeeId(dto.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists: " + dto.getEmployeeId());
        }

        Employee emp = toEntity(dto);
        return toDTO(employeeRepository.save(emp));
    }

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (!emp.getEmail().equals(dto.getEmail()) && employeeRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists: " + dto.getEmail());
        }

        emp.setFirstName(dto.getFirstName());
        emp.setLastName(dto.getLastName());
        emp.setEmail(dto.getEmail());
        emp.setPhone(dto.getPhone());
        emp.setSalary(dto.getSalary());
        emp.setJoiningDate(dto.getJoiningDate());
        emp.setAddress(dto.getAddress());
        if (dto.getStatus() != null)
            emp.setStatus(dto.getStatus());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            emp.setDepartment(dept);
        }

        return toDTO(employeeRepository.save(emp));
    }

    public void deleteEmployee(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(emp);
    }

    public EmployeeDTO updateStatus(Long id, EmployeeStatus status) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        emp.setStatus(status);
        return toDTO(employeeRepository.save(emp));
    }

    public String uploadProfileImage(Long id, MultipartFile file) throws IOException {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = "employee_" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        emp.setProfileImage("/api/uploads/" + filename);
        employeeRepository.save(emp);
        return "/api/uploads/" + filename;
    }

    public DashboardStatsDTO getDashboardStats() {
        long total = employeeRepository.count();
        long active = employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
        long inactive = employeeRepository.countByStatus(EmployeeStatus.INACTIVE);
        long departments = departmentRepository.count();

        List<Object[]> deptStats = employeeRepository.countByDepartment();
        Map<String, Long> deptMap = new LinkedHashMap<>();
        for (Object[] row : deptStats) {
            deptMap.put((String) row[0], (Long) row[1]);
        }

        double avgSalary = employeeRepository.findAll().stream()
                .filter(e -> e.getSalary() != null)
                .mapToDouble(e -> e.getSalary().doubleValue())
                .average()
                .orElse(0.0);

        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        long newJoinees = employeeRepository.findAll().stream()
                .filter(e -> e.getJoiningDate() != null && !e.getJoiningDate().isBefore(firstOfMonth))
                .count();

        return DashboardStatsDTO.builder()
                .totalEmployees(total)
                .activeEmployees(active)
                .inactiveEmployees(inactive)
                .totalDepartments(departments)
                .departmentStats(deptMap)
                .averageSalary(Math.round(avgSalary * 100.0) / 100.0)
                .newJoineesThisMonth(newJoinees)
                .build();
    }

    private EmployeeDTO toDTO(Employee emp) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(emp.getId());
        dto.setEmployeeId(emp.getEmployeeId());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setEmail(emp.getEmail());
        dto.setPhone(emp.getPhone());
        dto.setSalary(emp.getSalary());
        dto.setJoiningDate(emp.getJoiningDate());
        dto.setStatus(emp.getStatus());
        dto.setProfileImage(emp.getProfileImage());
        dto.setAddress(emp.getAddress());
        if (emp.getDepartment() != null) {
            dto.setDepartmentId(emp.getDepartment().getId());
            dto.setDepartmentName(emp.getDepartment().getName());
        }
        return dto;
    }

    private Employee toEntity(EmployeeDTO dto) {
        Employee emp = new Employee();
        emp.setEmployeeId(dto.getEmployeeId());
        emp.setFirstName(dto.getFirstName());
        emp.setLastName(dto.getLastName());
        emp.setEmail(dto.getEmail());
        emp.setPhone(dto.getPhone());
        emp.setSalary(dto.getSalary());
        emp.setJoiningDate(dto.getJoiningDate());
        emp.setAddress(dto.getAddress());
        emp.setStatus(dto.getStatus() != null ? dto.getStatus() : EmployeeStatus.ACTIVE);

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            emp.setDepartment(dept);
        }
        return emp;
    }
}
